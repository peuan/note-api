interface NoteDislikedPayload {
  userId: string;
  fromUserId: string;
}

export class NoteDislikedEvent {
  noteId: string;
  payload: NoteDislikedPayload;
  constructor(noteId: string, payload: NoteDislikedPayload) {
    this.noteId = noteId;
    this.payload = payload;
  }
}
