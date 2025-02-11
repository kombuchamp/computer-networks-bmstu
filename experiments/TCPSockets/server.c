#include <stdio.h>
#include <stdlib.h>

#include <sys/types.h>
#include <sys/socket.h>

#include <netinet/in.h>

int main() {
	char server_message[256] = "Server answer! Foo Bar Baz";

	// create server socket
	int server_socket;
	server_socket = socket(AF_INET, SOCK_STREAM, 0);

	// define address structure
	struct sockaddr_in server_address;
	server_address.sin_family = AF_INET;
	server_address.sin_port = htons(3000);
	server_address.sin_addr.s_addr = INADDR_ANY; // Any IP address on local machine

	// bind the socket to our IP:port
	bind(server_socket, (struct sockaddr *)&server_address, sizeof(server_address));

	listen(server_socket, 10);
	printf("Listening on port 3000...\n");

	int client_socket;
	while((client_socket = accept(server_socket, NULL, NULL)) >= 0) {
		send(client_socket, server_message, sizeof(server_message), 0);
		close(client_socket);
	}

	// close the connection
	close(server_socket);
	return 0;
}
