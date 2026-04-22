// ============================================================
// Firestore Service — CRUD for all collections
// ============================================================
// Collections: gallery | materials | lectures | enquiries | registrations
// ============================================================

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// ─── GALLERY ────────────────────────────────────────────────

/**
 * Add a new image to the gallery collection.
 * @param {{ imageUrl: string, title: string }} data
 * @returns {Promise<DocumentReference>}
 */
export const addGalleryImage = async ({ imageUrl, title = "", event = "" }) => {
  return await addDoc(collection(db, "gallery"), {
    imageUrl,
    title,
    event, // e.g., 'Aarambh - Annual Function'
    uploadedAt: serverTimestamp(),
  });
};

/**
 * Fetch all gallery images ordered by upload date (newest first).
 * @returns {Promise<Array>}
 */
export const getGalleryImages = async () => {
  const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Delete a gallery image document from Firestore.
 * @param {string} docId - Firestore document ID
 * @returns {Promise<void>}
 */
export const deleteGalleryImage = async (docId) => {
  await deleteDoc(doc(db, "gallery", docId));
};

/**
 * Update title and/or event of an existing gallery image.
 * @param {string} docId
 * @param {{ title: string, event: string }} updates
 * @returns {Promise<void>}
 */
export const updateGalleryImage = async (docId, { title, event }) => {
  const imageRef = doc(db, "gallery", docId);
  await updateDoc(imageRef, { title, event, updatedAt: serverTimestamp() });
};

// ─── STUDY MATERIALS ────────────────────────────────────────

/**
 * Add a study material entry to Firestore.
 * @param {{ title, subject, fileUrl, type }} data
 * @returns {Promise<DocumentReference>}
 */
export const addMaterial = async ({ title, standard, subject, fileUrl, type }) => {
  return await addDoc(collection(db, "materials"), {
    title,
    standard: standard || "Other",
    subject: subject || "General",
    fileUrl,
    type, // 'pdf' | 'image'
    uploadedAt: serverTimestamp(),
  });
};

/**
 * Fetch all materials, ordered by upload date (newest first).
 * @returns {Promise<Array>}
 */
export const getMaterials = async () => {
  const q = query(collection(db, "materials"), orderBy("uploadedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch materials filtered by subject.
 * @param {string} subject
 * @returns {Promise<Array>}
 */
export const getMaterialsBySubject = async (subject) => {
  const q = query(
    collection(db, "materials"),
    where("subject", "==", subject),
    orderBy("uploadedAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Delete a material entry from Firestore.
 * @param {string} docId
 * @returns {Promise<void>}
 */
export const deleteMaterial = async (docId) => {
  await deleteDoc(doc(db, "materials", docId));
};

// ─── FACULTY ────────────────────────────────────────────────

/**
 * Add a new faculty member.
 * @param {{ name, subject, qualification, experience, imageUrl }} data
 * @returns {Promise<DocumentReference>}
 */
export const addFaculty = async (data) => {
  return await addDoc(collection(db, "faculty"), {
    name: data.name || "",
    subject: data.subject || "",
    qualification: data.qualification || "",
    experience: data.experience || "",
    imageUrl: data.imageUrl || "",
    createdAt: serverTimestamp(),
  });
};

/**
 * Fetch all faculty members ordered by creation date.
 * @returns {Promise<Array>}
 */
export const getFaculty = async () => {
  const q = query(collection(db, "faculty"), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Update a faculty member's fields.
 * @param {string} docId
 * @param {Object} updates
 * @returns {Promise<void>}
 */
export const updateFaculty = async (docId, updates) => {
  const ref = doc(db, "faculty", docId);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
};

/**
 * Delete a faculty member.
 * @param {string} docId
 * @returns {Promise<void>}
 */
export const deleteFaculty = async (docId) => {
  await deleteDoc(doc(db, "faculty", docId));
};

// ─── LECTURES ───────────────────────────────────────────────

/**
 * Add a lecture to Firestore.
 * @param {{ subject, teacher, date, startTime, endTime, class: string }} data
 * @returns {Promise<DocumentReference>}
 */
export const addLecture = async (lectureData) => {
  return await addDoc(collection(db, "lectures"), {
    ...lectureData,
    createdAt: serverTimestamp(),
  });
};

/**
 * Update an existing lecture.
 * @param {string} docId
 * @param {Object} updates
 * @returns {Promise<void>}
 */
export const updateLecture = async (docId, updates) => {
  const lectureRef = doc(db, "lectures", docId);
  await updateDoc(lectureRef, { ...updates, updatedAt: serverTimestamp() });
};

/**
 * Delete a lecture.
 * @param {string} docId
 * @returns {Promise<void>}
 */
export const deleteLecture = async (docId) => {
  await deleteDoc(doc(db, "lectures", docId));
};

/**
 * Subscribe to real-time lecture updates (onSnapshot).
 * @param {Function} callback - Called with array of lectures on any change
 * @returns {Function} unsubscribe function — call it to stop listening
 */
export const subscribeToLectures = (callback) => {
  const q = query(collection(db, "lectures"), orderBy("date", "asc"));
  return onSnapshot(q, (snapshot) => {
    const lectures = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(lectures);
  });
};

// ─── ENQUIRIES ──────────────────────────────────────────────

/**
 * Submit an admission enquiry to Firestore.
 * @param {{ name, email, phone, currentClass, course, message }} data
 * @returns {Promise<DocumentReference>}
 */
export const submitEnquiry = async ({
  name,
  email,
  phone,
  currentClass,
  course,
  message,
}) => {
  return await addDoc(collection(db, "enquiries"), {
    name,
    email,
    phone,
    currentClass,
    course,
    message,
    createdAt: serverTimestamp(),
  });
};

// ─── MSAT REGISTRATIONS ─────────────────────────────────────

/**
 * Submit an MSAT (Manch Scholarship Admission Test) registration.
 * @param {{ name, email, phone, currentClass, preferredDate, school }} data
 * @returns {Promise<DocumentReference>}
 */
export const submitMSATRegistration = async ({
  name,
  email,
  phone,
  currentClass,
  preferredDate,
  school,
}) => {
  return await addDoc(collection(db, "registrations"), {
    name,
    email,
    phone,
    currentClass,
    preferredDate,
    school,
    createdAt: serverTimestamp(),
  });
};

// ─── RESULTS ─────────────────────────────────────────────────

/**
 * Add a result entry (topper / result card).
 * @param {{ name, score, exam, year, category, imageUrl, description }} data
 */
export const addResult = async (data) => {
  return await addDoc(collection(db, "results"), {
    name: data.name || "",
    score: data.score || "",
    exam: data.exam || "",
    year: data.year || "",
    category: data.category || "NEET/JEE",
    imageUrl: data.imageUrl || "",
    description: data.description || "",
    createdAt: serverTimestamp(),
  });
};

/**
 * Fetch all results ordered by creation date (newest first).
 */
export const getResults = async () => {
  const q = query(collection(db, "results"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Update a result entry.
 */
export const updateResult = async (docId, updates) => {
  const ref = doc(db, "results", docId);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
};

/**
 * Delete a result entry.
 */
export const deleteResult = async (docId) => {
  await deleteDoc(doc(db, "results", docId));
};

/**
 * Update study material text fields (title, subject).
 */
export const updateMaterial = async (docId, updates) => {
  const ref = doc(db, "materials", docId);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
};
