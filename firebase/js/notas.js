// script.js
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('addNoteButton');
    const addNotePopup = document.getElementById('addNotePopup');
    const closeAddNotePopup = document.getElementById('closeAddNotePopup');
    const saveNoteButton = document.getElementById('saveNoteButton');
    const notesContainer = document.getElementById('notesContainer');
    const viewNotePopup = document.getElementById('viewNotePopup');
    const closeViewNotePopup = document.getElementById('closeViewNotePopup');
    const viewNoteTitle = document.getElementById('viewNoteTitle');
    const viewNoteContent = document.getElementById('viewNoteContent');
    const viewNoteImage = document.getElementById('viewNoteImage');

    // Inicializar Firestore y Storage
    const db = getFirestore();
    const storage = getStorage();

    // Mostrar pop-up para añadir nota
    addNoteButton.addEventListener('click', () => {
        addNotePopup.style.display = 'flex';
    });

    // Cerrar pop-up de añadir nota
    closeAddNotePopup.addEventListener('click', () => {
        addNotePopup.style.display = 'none';
    });

    // Guardar nueva nota
    saveNoteButton.addEventListener('click', async () => {
        const noteTitle = document.getElementById('noteTitle').value;
        const noteContent = document.getElementById('noteContent').value;
        const noteImage = document.getElementById('noteImage').files[0];

        if (noteTitle && noteContent) {
            let imageUrl = null;
            if (noteImage) {
                const storageRef = ref(storage, `notes_images/${noteImage.name}`);
                try {
                    await uploadBytes(storageRef, noteImage);
                    imageUrl = await getDownloadURL(storageRef);
                } catch (e) {
                    console.error("Error uploading image: ", e);
                }
            }

            try {
                await addDoc(collection(db, "notas"), {
                    title: noteTitle,
                    content: noteContent,
                    image: imageUrl || null
                });
                renderNotes();
                addNotePopup.style.display = 'none';
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    });

    // Mostrar pop-up para ver nota
    notesContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('note-preview')) {
            const noteId = e.target.getAttribute('data-id');
            try {
                const docRef = doc(db, "notas", noteId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const note = docSnap.data();
                    viewNoteTitle.textContent = note.title || 'Sin título';
                    viewNoteContent.textContent = note.content || 'Sin contenido';
                    if (note.image) {
                        viewNoteImage.src = note.image;
                        viewNoteImage.style.display = 'block';
                    } else {
                        viewNoteImage.style.display = 'none';
                    }
                    viewNotePopup.style.display = 'flex';
                } else {
                    console.log("No such document!");
                }
            } catch (e) {
                console.error("Error getting document: ", e);
            }
        }
    });

    // Cerrar pop-up de ver nota
    closeViewNotePopup.addEventListener('click', () => {
        viewNotePopup.style.display = 'none';
    });

    // Renderizar notas
    async function renderNotes() {
        notesContainer.innerHTML = '';
        try {
            const querySnapshot = await getDocs(collection(db, "notas"));
            querySnapshot.forEach((doc) => {
                const note = doc.data();
                notesContainer.innerHTML += `
                    <div class="note-preview" data-id="${doc.id}">
                        <h3>${note.title || 'Sin título'}</h3>
                        <p>${(note.content || '').substring(0, 100)}...</p>
                        ${note.image ? `<img src="${note.image}" alt="Imagen de la nota" style="width:100px;height:auto;">` : ''}
                    </div>
                `;
            });
        } catch (e) {
            console.error("Error getting documents: ", e);
        }
    }

    // Inicializar notas al cargar la página
    renderNotes();
});
