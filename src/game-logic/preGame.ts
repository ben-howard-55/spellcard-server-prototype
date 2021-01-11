import cardRoundLogic from './card-logic/cardRoundLogic';
import {Card} from '../types'

/**
 * Pre-game logic that occurs before the spell-card game begins
 */
const TIMERLENGTH = 30000;

export default function pregame(socket, roomID) {
   // start timer in socket.io room
   socket.to(roomID).emit('start pre-game');

   // send first 5 cards to each user in the room
   // TODO: turn into playerID 
   // cards selected, and send cards to game
   let cards = cardRoundLogic();
   socket.to(roomID).emit('cards', cards)

   // On either timer TimeOut or Continue button press, start game
   let preGamePromsie = new Promise((fulfill, reject) => {
      // start timer
      let timer = setTimeout(() => {
         // start the game
         socket.to(roomID).emit('stop pre-game');

         // send selected cards to the server-side game
         fulfill(cards);

      }, TIMERLENGTH);

      // if continue is heard, stop the timeout
      socket.on('continue', msg => {
         clearTimeout(timer);
         socket.to(roomID).emit('stop pre-game');

         // TODO: logic to replace the selected cards and generate new ones
         
         socket.to(roomID).emit('cards', cards)

         // send selected cards to the server-side game
         fulfill(cards);
      })
   }).catch(() => console.log("In pre-game.js, ERROR"));

   
   // if fulfilled then send the card information to the game
   preGamePromsie.then(((res): Card[] => {      
      return res;
   }),
   ((err) => {
      // if the promise is for somereason reject, return 5 new cards
      // TODO: disconnect the socket and reset the game?
      console.log(err);
      return cardRoundLogic();
   }));
}