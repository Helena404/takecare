import mongoose from 'mongoose';

// Определение схемы данных для объектов архитектуры
const architectureSchema = new mongoose.Schema(
	{
    title: { 
		type: String,
		required: true 
	},
	titleEng:{
		type: String,
		required: true
	},
    address: { 
		type: String, 
		required: true 
	},
    gosreester: { 
		type: String 
	},
    category: { 
		type: String,
		required: true  
	},
    securityStatus: { 
		type: String 
	},
    date: { 
		type: String 
	},
	century: { 
		type: String,
		required: true  
	},
    coordinates: { 
		type: String,
		required: true  
	},
    state: { 
		type: String,
		required: true  
	},
    typeRu: { 
		type: String 
	},
    type: { 
		type: String 
	},
	text: {
		type: String
	},
		photoUrl: String,
	},
	{
		timestamps: true,
	}
);

// Создание модели для объектов архитектуры на основе схемы
const Architecture = mongoose.model('Architecture', architectureSchema);

// Экспорт модели для использования в других файлах
export default Architecture;
