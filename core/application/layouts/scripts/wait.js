function wait(nsegundos) {
objetivo = (new Date()).getTime() + 1000 * Math.abs(nsegundos);
while ( (new Date()).getTime() < objetivo );
};

