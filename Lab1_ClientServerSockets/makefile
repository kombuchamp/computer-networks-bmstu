build:
	cc cipher_util.c -c
	cc client.c cipher_util.o -o client
	cc server.c cipher_util.o -o server
clean:
	rm *.swo *.o