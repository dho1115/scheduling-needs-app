import { DateTime } from "luxon";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

//fetch all documents.
export const fb_fetchAllDocs = async (collection_name, location=null) => {
   const documents = [];

   try {
      const collection_name_ref = collection(db, collection_name);
      const snapshot_of_docs = await getDocs(collection_name_ref);
      snapshot_of_docs.forEach(doc => documents.push({ id: doc.id, ...doc.data() }));

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
export const fb_deleteOneDocument = async (collection_name, _docID, location = null, documentData={}, condition=null) => {
   try {
      if (typeof (condition) == 'function') {
         if (condition()) {
            const documentReference = doc(db, collection_name, _docID);
            const deleteDocumentResult = await deleteDoc(documentReference);

            return { deleteDocumentResult, _docIDdeleted: _docID, deletedThisData: documentData };
         }
         
         else return { message: `None of the documents came back true for ${condition}.`, documentData };
         
      } else {
         const documentReference = doc(db, collection_name, _docID);
            const deleteDocumentResult = await deleteDoc(documentReference);

            return { deleteDocumentResult, _docIDdeleted: _docID, deletedThisData: documentData };
      }      
   } catch (error) {
      console.error({ message: "Error in fb_deleteOneDocument (crud_basic_jsx).", location, error, errorMessage: error.message, errorName: error.name });
   }
}

export const fb_BatchDeleteExpiredShifts = async (location) => {
   const COLLECTIONS = ['shiftsAvailable', 'shiftsWithApplicants', 'shiftsPendingConfirmation', 'shiftsConfirmed'];

   const unexpired_shifts = [];

   try {
      COLLECTIONS.forEach(async collection_name => {
         const fb_docs_array = await fb_fetchAllDocs(collection_name, location); //[docs (if any)]

         if (fb_docs_array.length) {
            const BatchDeleteExpiredShifts = fb_docs_array.forEach(async shift => {
               const currentDate = DateTime.local(); //current date

               if (shift.date_of_shift) {
                  const dateTime_dateOfShift = DateTime.fromISO(shift.date_of_shift); //convert shift date to DateTime format.
                  (currentDate > dateTime_dateOfShift) ?
                     await fb_deleteOneDocument(collection_name, shift.id, location, shift)
                     :
                     unexpired_shifts.push(shift);
               } else if (shift.date) {
                  const dateTime_date = DateTime.fromISO(shift.date); //convert shift date to DateTime format.
                  (currentDate > dateTime_date) ?
                     fb_deleteOneDocument(collection_name, shift.id, location, shift)
                     :
                     unexpired_shifts.push(shift)
               }
            });
         }
         
         return unexpired_shifts;
      })
      return {
         message: `Batch Delete Successful!!! The following shifts are still current: ${JSON.stringify(unexpired_shifts)}.`,
         undeleted_shifts: unexpired_shifts
      };
   } catch (error) {
      console.error({ message: "ERROR with fb_BatchDelete Function!!!", location, unexpired_shifts, error, errorMessage: error.message, errorName: error.name });

      return { message: "ERROR with fb_BatchDelete Function!!!", location, unexpired_shifts, error, errorMessage: error.message, errorName: error.name }
   }
}