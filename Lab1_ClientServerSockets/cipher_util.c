#include "cipher_util.h"

void cipher_msg(char *msg, char *key, char *encripted_msg) {
    int msg_len = strlen(msg);
    int key_len = strlen(key);

    for(int i = 0; i < msg_len; ++i)
        encripted_msg[i] = ((msg[i] + key[i % key_len]) % 256);
    encripted_msg[msg_len] = '\0';
}

void decipher_msg(char *msg, char *key, char *decripted_msg) {
    int msg_len = strlen(msg);
    int key_len = strlen(key);

    for(int i = 0; i < msg_len; ++i)
        decripted_msg[i] = (((msg[i] - key[i % key_len]) + 256) % 256);
    decripted_msg[msg_len] = '\0';
}