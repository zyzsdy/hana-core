import * as path from 'path'
import * as fs from 'fs'
import * as node_zlib from 'zlib'
import DynamicDictionaries from '../dict/DynamicDictionaries'


export default class DictionaryLoader{
    dic: DynamicDictionaries;
    dic_path: string;
    /**
     * DictionaryLoader base constructor
     * @param {string} dic_path Dictionary path
     * @constructor
     */
    constructor(dic_path: string) {
        this.dic = new DynamicDictionaries();
        this.dic_path = dic_path;
    }

    loadArrayBuffer(file: string, callback: (err: any, dic?: ArrayBuffer) => void) {
        fs.readFile(file, function (err, buffer) {
            if(err) {
                return callback(err);
            }
            node_zlib.gunzip(buffer, function (err2, decompressed) {
                if(err2) {
                    return callback(err2);
                }
                var typed_array = new Uint8Array(decompressed);
                callback(null, <ArrayBuffer>typed_array.buffer);
            });
        });
    };

    /**
     * Load dictionary files
     * @param {DictionaryLoader~onLoad} load_callback Callback function called after loaded
     */
    load(load_callback: (err: any, dic: DynamicDictionaries) => void) {
        var dic = this.dic;
        var dic_path = this.dic_path;
        var loadArrayBuffer = this.loadArrayBuffer;

        Promise.all([new Promise((res, rej)=>{
            //Trie
            Promise.all(["base.dat.gz", "check.dat.gz"].map(filename => new Promise<ArrayBuffer>((resmap, rejmap)=>{
                loadArrayBuffer(path.join(dic_path, filename), (err, buffer) => {
                    if(err) rejmap(err);
                    resmap(buffer);
                });
            }))).then(result => {
                var base_buffer = new Int32Array(result[0]);
                var check_buffer = new Int32Array(result[1]);
                dic.loadTrie(base_buffer, check_buffer);
                res()
            }).catch(reason => rej(reason));
        }), new Promise((res, rej)=>{
            //Token info dictionaries
            Promise.all(["tid.dat.gz", "tid_pos.dat.gz", "tid_map.dat.gz"].map(filename => new Promise<ArrayBuffer>((resmap, rejmap)=>{
                loadArrayBuffer(path.join(dic_path, filename), (err, buffer) => {
                    if(err) rejmap(err);
                    resmap(buffer);
                });
            }))).then(result => {
                var token_info_buffer = new Uint8Array(result[0]);
                var pos_buffer = new Uint8Array(result[1]);
                var target_map_buffer = new Uint8Array(result[2]);

                dic.loadTokenInfoDictionaries(token_info_buffer, pos_buffer, target_map_buffer);
                res();
            }).catch(reason => rej(reason));
        }), new Promise((res, rej)=>{
            //Connection cost matrix
            loadArrayBuffer(path.join(dic_path, "cc.dat.gz"), function (err, buffer) {
                if(err) rej(err);
                var cc_buffer = new Int16Array(buffer);
                dic.loadConnectionCosts(cc_buffer);
                res();
            });
        }), new Promise((res, rej)=>{
            //Unknown dictionaries
            Promise.all(["unk.dat.gz", "unk_pos.dat.gz", "unk_map.dat.gz", "unk_char.dat.gz", "unk_compat.dat.gz", "unk_invoke.dat.gz"].map(filename=>new Promise<ArrayBuffer>((resmap, rejmap)=>{
                loadArrayBuffer(path.join(dic_path, filename), (err, buffer) => {
                    if(err) rejmap(err);
                    resmap(buffer);
                });
            }))).then(result => {
                var unk_buffer = new Uint8Array(result[0]);
                var unk_pos_buffer = new Uint8Array(result[1]);
                var unk_map_buffer = new Uint8Array(result[2]);
                var cat_map_buffer = new Uint8Array(result[3]);
                var compat_cat_map_buffer = new Uint32Array(result[4]);
                var invoke_def_buffer = new Uint8Array(result[5]);

                dic.loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer);
                // dic.loadUnknownDictionaries(char_buffer, unk_buffer);
                res();
            }).catch(reason => rej(reason));
        })]).then(result => load_callback(null, dic)).catch(reason => load_callback(reason, dic));
    };

    /**
     * Callback
     * @callback DictionaryLoader~onLoad
     * @param {Object} err Error object
     * @param {DynamicDictionaries} dic Loaded dictionary
     */
}