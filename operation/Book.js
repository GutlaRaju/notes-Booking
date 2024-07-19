const noteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User'},
    title: { type: String },
    content: { type: String},
    tags: [String],
    archived: { type: Boolean},
    trashed: { type: Boolean },
    backgroundColor: { type: String, default: 'yellow' },
    reminderDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', noteSchema);