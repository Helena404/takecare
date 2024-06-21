import mongoose from 'mongoose';

// Определение схемы статьи
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
	titleEng: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Создание модели статьи на основе схемы
const Article = mongoose.model('Article', articleSchema);

export default Article;
