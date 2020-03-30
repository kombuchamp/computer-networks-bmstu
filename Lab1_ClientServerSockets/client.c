#include <stdio.h>
#include <stdlib.h>

#include <sys/types.h>
#include <sys/socket.h>

#include <netinet/in.h>

#include "cipher_util.h"

int main() {
	// create socket
	int network_socket;
	network_socket = socket(AF_INET, SOCK_STREAM, 0);

	// specify an address to connect to
	struct sockaddr_in server_address;
	server_address.sin_family = AF_INET;
	server_address.sin_port = htons(3000);
	server_address.sin_addr.s_addr = INADDR_ANY; // localhost

	printf("Connecting to server...\n");

	int connection = connect(network_socket, (struct sockaddr *)&server_address, sizeof(server_address));
	if (connection == -1) {
		printf("Couldn't connect\n");
		exit(-1);
	}

	// receive data from server
	char server_response[256], deciphered_server_response[256];
	recv(network_socket, &server_response, sizeof(server_response), 0);
	printf("Received message: %s. Deciphering...\n", server_response);
	decipher_msg(server_response, HARDCODED_KEY, deciphered_server_response);
	printf("Deciphering complete: %s. Sending message to server...\n", deciphered_server_response);
	send(network_socket, deciphered_server_response, sizeof(deciphered_server_response), 0);
	printf("Done\n");
	// close the connection
	close(network_socket);

	return 0;
}
