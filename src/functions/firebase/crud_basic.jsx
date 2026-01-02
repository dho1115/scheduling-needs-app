import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import { db } from "../../firebase";

//fetch all documents.
export const fb_fetchAllDocs = async (collection_name, location=null) => {
   const documents = [];

   try {
      const collection_name_ref = collection(db, collection_name);
      const snapshot_of_docs = await getDocs(collection_name_ref);
      snapshot_of_docs.forEach(doc => documents.push({ id: doc.id, data: doc.data() }));

      return documents;
   } catch (error) {
      console.error({ message: "Error in fb_fetchData!!!", location, documents, error, errorMessage: error.message, errorName: error.name });
   }
}

//fetch single document by id.
export const fb_fetchOneDoc = async (collection_name, _docID, location = null) => {
   try {
      const docReference = doc(db, collection_name, _docID);
      const documentSnapshot = await getDoc(docReference);

      if (documentSnapshot.exists()) return documentSnapshot.data()
      else {
         const error_object = { message: `Error inside fb_fetchSpecificData (crud_basic.jsx). documentSnapshot.exists() returned ${documentSnapshot.exists()}.`, location };
         
         throw new Error(`${JSON.stringify(error_object)}.`);
      }
   } catch (error) {
      console.error({ message: "Error inside fb_fetchSpecificData (crud_basic.jsx).", location, error, errorMessage: error.message, errorName: error.name });
   }
}

//Add single document.
export const fb_addOneDocument = async (collection_name, newDataObject, _id, location = null) => {
   try {
      const collectionReference = doc(db, collection_name, _id);
      const docReference = await setDoc(collectionReference, { ...newDataObject });

      return { _documentID: _id, newDataObject };
   } catch (error) {
      console.error({ message: "Error in fb_addOneDocument (crud_basic.js).", location, error, errorMessage: error.message, errorName: error.name });
   }
}

//Delete single document.
export const fb_deleteOneDocument = async (collection_name, _docID, location = null, documentData={}) => {
   try {
      const documentReference = doc(db, collection_name, _docID);
      const deleteDocumentResult = await deleteDoc(documentReference);

      return { deleteDocumentResult, _docIDdeleted: _docID, deletedThisData: documentData };
   } catch (error) {
      console.error({ message: "Error in fb_deleteOneDocument (crud_basic_jsx).", location, error, errorMessage: error.message, errorName: error.name });
   }
}