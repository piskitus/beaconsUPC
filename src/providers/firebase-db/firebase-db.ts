import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class FirebaseDbProvider {

  

  constructor(public afDB: AngularFireDatabase, public auth: AuthProvider) {
    console.log('➡️ Firebase Provider📊');
  }

  //SETS TO SAVE AND UPDATE

  saveMarker(marker){
    if(!marker.id){
      marker.id = Date.now(); //ID único
    }
     return this.afDB.database.ref('markers/'+marker.id).set(marker)
  }

  updateMarker(marker){
    return this.afDB.database.ref('markers/'+marker.id).update(marker)
  }

  saveNews(news){
    if(!news.id){
      news.id = Date.now(); //Le creo un ID único que será la fecha de creación de esa notica
    }
    return this.afDB.database.ref('news/'+news.id).set(news)
  }

  saveUserNews(news){
    return this.afDB.database.ref('users/'+this.auth.getUser()+'/news/'+news.id).set(news)
  }

  updateNews(news){
    return this.afDB.database.ref('news/'+news.id).update(news)
  }

  saveBeacon(beacon){
    if(!beacon.key){
      beacon.key = beacon.uuid+":"+beacon.major+":"+beacon.minor;//Creo la clave única del beacon
    }
    return this.afDB.database.ref('beacons/'+beacon.key).set(beacon)
  }

  updateBeacon(beacon){
    return this.afDB.database.ref('beacons/'+beacon.key).update(beacon)

  }

  saveReminder(reminder){
    if(!reminder.id){
      reminder.id = Date.now();
    }
    return this.afDB.database.ref('users/'+this.auth.getUser()+'/reminders/'+reminder.id).set(reminder)
  }

  updateReminder(reminder){
    return this.afDB.database.ref('users/'+this.auth.getUser()+'/reminders/'+reminder.id).update(reminder)

  }

  updateUser(user){
    return this.afDB.database.ref('users/'+user.password).update(user)
  }

  // saveUserData(user){
  //   return this.afDB.database.ref('users/'+user.uid).set(user)
  // }

//EN principio no se utilizan
  // saveNewsInBeacon(beaconKey, newsID){
  //   return this.afDB.database.ref('beacons/'+beaconKey+'/newsID').set(newsID)
  // }
  //
  // saveMarkerInBeacon(beaconKey, markerID){
  //
  // }



  //GETS

  getMarkers(){
    return this.afDB.list('markers');
  }

  getNews(){
    return this.afDB.list('news');
  }

  getUserEmail(){

  }

  getBeacons(){
    return this.afDB.list('beacons');
  }

  getRegions(){
    return this.afDB.list('regions');
  }

  getUsers(){
    return this.afDB.list('users');
  }

  getUserReminders(){
    return this.afDB.list('users/'+this.auth.getUser()+'/reminders')
  }

  getUserNews(){
    return this.afDB.list('users/'+this.auth.getUser()+'/news')
  }


//Cojo el identificador de la noticia de un beacon concreto
  getNewsId(beaconKey){
    console.log("BEACON KEY QUE ME LLEGA: ",beaconKey)
    return this.afDB.database.ref('beacons/' + beaconKey).once('value');
  }

//Cojo una noticia específica a partir de su identificador
  getSpecificNews(newsID){
    return this.afDB.database.ref('news/' + newsID).once('value');
  }
  getSpecificNews2(newsID){
    return this.afDB.database.ref('news/' + newsID);
  }

  getSpecificMarker(markerID){
    return this.afDB.database.ref('markers/'+markerID).once('value');
  }

  getSpecificBeacon(beaconKey){
    return this.afDB.database.ref('beacons/'+beaconKey).once('value');
  }

//Cojo los datos guardados de un usuario
  getUserData(){
    return this.afDB.database.ref('users/'+this.auth.getUser()).once('value');
  }

  getUserReminder(reminderID){

  }




  //DELETES

  public deleteNews(id){
        this.afDB.database.ref('news/'+id).remove();
  }

  public deleteMarker(id){
        this.afDB.database.ref('markers/'+id).remove();
  }

  public deleteBeacon(key){
        this.afDB.database.ref('beacons/'+key).remove();
  }

  public deleteUser(key){ // la key está guardada en el parámetro 'password' en la bbdd
        this.afDB.database.ref('users/'+key).remove();
  }

  public deleteUserReminder(id){
        this.afDB.database.ref('users/'+this.auth.getUser()+'/reminders/'+id).remove();
  }

  public deleteUserNews(id){
        this.afDB.database.ref('users/'+this.auth.getUser()+'/news/'+id).remove();
  }





  ////////////////////////////////////////////////
  ////////////        CHATS         //////////////
  ////////////////////////////////////////////////

  createChat(chat){
    if(!chat.id){
      chat.id = Date.now();
    }
    return this.afDB.database.ref('chats/'+chat.id).set(chat)
  }

  updateChat(chat){
    return this.afDB.database.ref('chats/'+chat.id).update(chat)
  }

  getChats(){
    return this.afDB.list('chats/')
  }

  getSpecificChat(chatID){
    return this.afDB.database.ref('chats/'+chatID).once('value');
  }

  // para conectar con ".on" y así controlar cambios de estado en la base de datos (siempre estará escuchando esa rama)
  getSpecificChat2(chatID){
    return this.afDB.database.ref('chats/'+chatID);
  }

  public deleteChat(id){
        this.afDB.database.ref('chats/'+id).remove();
  }


  ////////////////////////////////////////////////
  ////////////     CHAT MESSAGES    //////////////
  ////////////////////////////////////////////////

  createChatMessage(chatID, message){
    if(!message.id){
      message.id = Date.now();
    }
    return this.afDB.database.ref('chats/'+chatID+'/messages/'+message.id).set(message)
  }

  getMessagesFromChat(chatID){
    return this.afDB.list('chats/'+chatID+'/messages')
  }

  public deleteChatMessages(id){
        this.afDB.database.ref('chats/'+id+'/messages').remove();
  }


  ////////////////////////////////////////////////
  ////////////       SUBJECTS       //////////////
  ////////////////////////////////////////////////

  createSubject(subject){
    return this.afDB.database.ref('users/'+this.auth.getUser()+'/subjects/'+subject.acronym).set(subject)
  }

  public deleteSubject(acronym){
        this.afDB.database.ref('users/'+this.auth.getUser()+'/subjects/'+acronym).remove();
  }

  getUserSubjects(){
    return this.afDB.list('users/'+this.auth.getUser()+'/subjects')
  }


  ////////////////////////////////////////////////
  ////////////       CLASSES        //////////////
  ////////////////////////////////////////////////

  createClass(clase){
    if(!clase.id){
      clase.id = Date.now();
    }
    return this.afDB.database.ref('users/'+this.auth.getUser()+'/classes/'+clase.day+'/'+clase.id).set(clase)
  }

  updateClass(clase){
    return this.afDB.database.ref('users/'+this.auth.getUser()+'/classes/'+clase.day+'/'+clase.id).update(clase)
  }

  getUserClasses(){
    return this.afDB.list('users/'+this.auth.getUser()+'/classes')
  }

  getUserClassesDay(day){
    return this.afDB.list('users/'+this.auth.getUser()+'/classes/'+day)
  }

  getDayClasses(day){
    return this.afDB.list('users/'+this.auth.getUser()+'/classes/'+day)
  }

  public deleteClass(day, id){
        this.afDB.database.ref('users/'+this.auth.getUser()+'/classes/'+day+'/'+id).remove();
  }





}
