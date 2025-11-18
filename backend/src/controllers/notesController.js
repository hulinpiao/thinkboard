import Note from "../models/Note.js";

export async function getAllNotes (req, res) {
    try {
        const notes = await Note.find().sort({createdAt:-1}); //newest first
        res.status(200).json(notes)
    } catch (error) {
        console.error("Error in getAllNotes controller", error)
        res.status(500).json({message:"Internal server error"})
    }
}

export async function getNotesById (req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message: "Note not found!"});
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNotesById controller", error)
        res.status(500).json({message:"Internal server error"})
    }
}

export async function createNote (req, res) {
   try {
    const {title, content} = req.body
    console.log(req.body)
    const newNote = new Note({title, content})

    const savedNote = await newNote.save();
    res.status(201).json({
        message:"Note Created Successfully",
        note: savedNote
    });
   } catch (error) {
     console.error("Error in createNote controller", error);
     res.status(500).json({message: "Internal server error"});
   }
}

export async function updateNote (req, res) {
    try {
        const {title, content} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id, 
            {title, content}, 
            {new: true}
        )
        if(!updatedNote) return res.status(404).json({message:"Note not found"})

        res.status(200).json({
            message: "Note Updated successfully",
            note: updatedNote
        })
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message: "Internal server error"})
    }
}

export async function deleteNote (req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id)
        if(!deleteNote) return res.status(404).json({message: "Note not found"});
        res.status(200).json({
            message: "Note delted successfully"
        })
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message: "Internal server error"})
    }
}