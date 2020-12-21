interface NoteLikedPayload {
  userId: string;
  fromUserId: string;
  title: string;
}

export class NoteLikedEvent {
  noteId: string;
  payload: NoteLikedPayload;
  constructor(noteId: string, payload: NoteLikedPayload) {
    this.noteId = noteId;
    this.payload = payload;
  }
}
