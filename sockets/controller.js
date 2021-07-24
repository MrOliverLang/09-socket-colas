const TicketControl = require('../models/ticket-control');


const ticketControl = new TicketControl();



const socketController = (socket) => {
    
    //cuando un cliente se conecta
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit( 'ultimos4', ticketControl.ultimos4 );
    socket.emit( 'tickets-pendietnes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
       const siguiente = ticketControl.siguiente();
       callback( siguiente );
       socket.broadcast.emit('tickets-pendietnes', ticketControl.tickets.length);
    })

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        
        if( !escritorio ) {
            return callback({
                ok: false,
                msg: 'Escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );

        socket.broadcast.emit( 'ultimos4', ticketControl.ultimos4 );
        socket.emit( 'tickets-pendietnes', ticketControl.tickets.length);
        socket.broadcast.emit( 'tickets-pendietnes', ticketControl.tickets.length);

        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    });

}



module.exports = {
    socketController
}

