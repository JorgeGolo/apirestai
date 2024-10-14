import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, collectionData, doc, updateDoc, deleteDoc, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IChat } from '../app.component';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  constructor(private firestore: Firestore) { }

  // Obtener documentos de una colección
  getCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<any[]>;
  }

  // Añadir un documento a una colección (ahora incluye un timestamp y opcionalmente un userId)
  addDocument(collectionName: string, data: any, userId?: string): Promise<any> {
    const collectionRef = collection(this.firestore, collectionName);
    
    // Añadir un timestamp y opcionalmente el userId al chat
    const newData = {
      ...data,
      timestamp: Timestamp.now(), // Marca de tiempo
      ...(userId && { createdBy: userId }) // Asociar el chat al usuario si se proporciona un userId
    };

    return addDoc(collectionRef, newData);
  }


  async getChats(): Promise<IChat[]> {
    const chatsCollection = collection(this.firestore, 'chats');
    const chatDocs = await getDocs(chatsCollection);
  
    return chatDocs.docs.map((doc, index) => {
      const data = doc.data(); // Obtiene los datos del documento
      const chat: IChat = {
        id: index, // O usa un ID persistente si está disponible
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

  
}