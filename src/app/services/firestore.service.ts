import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, collectionData, doc, updateDoc, deleteDoc, Timestamp, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IChat } from '../app.component';
import { IChatResponse } from '../app.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  constructor(private firestore: Firestore, private authService: AuthService) { }

  // Obtener documentos de una colección
  getCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<any[]>;
  }

  addDocument(collectionName: string, data: any, userId?: string): Promise<any> {
    const collectionRef = collection(this.firestore, collectionName);
  
    const newData = {
      ...data,
      timestamp: Timestamp.now(), // Añadir timestamp
      ...(userId && { createdBy: userId }) // Añadir el userId si está presente
    };
  
    return addDoc(collectionRef, newData);
  }


  async getChats(): Promise<IChat[]> {

    const userId = this.authService.getCurrentUserId(); // Obtén el ID del usuario logueado
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario.');
      return []; // Retorna un array vacío si no hay usuario logueado
    }

    const chatsCollection = collection(this.firestore, 'chats');
  // Filtra los chats donde el campo userId coincida con el ID del usuario autenticado
  const chatsQuery = query(chatsCollection, where('createdBy', '==', userId));
  
  const chatDocs = await getDocs(chatsQuery); // Ejecuta la consulta filtrada
      
    return chatDocs.docs.map(doc => {
      const data = doc.data(); // Obtiene los datos del documento
      const chat: IChat = {
        id: doc.id, // Usa el ID del documento de Firestore
        userId: data['userId'] || '',
        role: data['role'] || '', // Usa la sintaxis de acceso por índice
        model: data['model'] || '', // Usa la sintaxis de acceso por índice
        shortName: data['shortName'] || '', // Usa la sintaxis de acceso por índice
        responses: data['responses'] || [] // Asegúrate de que sea un array
      };
      return chat;
    });
  }


   
  // Actualizar un documento
  updateDocument(collectionName: string, id: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    return updateDoc(docRef, data);
  }

  // Eliminar un documento
  deleteDocument(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(docRef);
  }

  // FirestoreService.ts
  deleteChat(id: string): Promise<void> {
    const chatDocRef = doc(this.firestore, `chats/${id}`); // Obtén la referencia del documento a eliminar
    return deleteDoc(chatDocRef); // Elimina el documento
  }

  // Método para actualizar el nombre del chat en la base de datos
  async updateChat(chat: IChat): Promise<void> {
    const chatDocRef = doc(this.firestore, `chats/${chat.id}`); // Obtiene la referencia del documento a actualizar
    return updateDoc(chatDocRef, {
      shortName: chat.shortName // Actualiza solo el shortName
    });
  }

  // Método para actualizar las respuestas de un chat en la base de datos, aceptando 2 parámetros
  updateChatResponses(chatId: string, responses: IChatResponse[]): Promise<void> {
    const chatDocRef = doc(this.firestore, `chats/${chatId}`); // Obtiene la referencia del documento a actualizar
    return updateDoc(chatDocRef, {
      responses: responses // Actualiza el campo responses con las respuestas
    });
  }
}