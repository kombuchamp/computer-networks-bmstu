#include <stdio.h>
#include <stdlib.h>

#include <sys/types.h>
#include <sys/socket.h>

#include <netinet/in.h>

int main() {
	// create socket
	int network_socket;
	network_socket = socket(AF_INET, SOCK_STREAM, 0);

	// specify an address to connect to
	struct sockaddr_in server_address;
	server_address.sin_family = AF_INET;
	server_address.sin_port = htons(3000);
	server_address.sin_addr.s_addr = INADDR_ANY; // localhost

	int connection = connect(network_socket, (struct sockaddr *)&server_address, sizeof(server_address));
	if (connection == -1) {
		printf("Couldn't connect");
		exit(-1);
	}

	// Receive data from server
	char server_response[256];
	recv(network_socket, &server_response, sizeof(server_response), 0);

	// print server rwsponse
	printf("Server response: %s\n", server_response);

	// Close the connection
	close(network_socket);

	return 0;
}
