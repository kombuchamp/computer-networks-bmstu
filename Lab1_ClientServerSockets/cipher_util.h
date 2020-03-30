#include <stdlib.h>
#include <string.h>
#include <stdio.h>

#define HARDCODED_KEY "HARDCODED_KEY"

void cipher_msg(char *msg, char *key, char *encripted_msg);
void decipher_msg(char *msg, char *key, char *decripted_msg);