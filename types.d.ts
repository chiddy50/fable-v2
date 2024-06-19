interface StoryTechnique {
    title: string;
    description: string;
}

interface Message {
    id: string|number,
    type: string,
    message: string,
    disable: boolean,
    options?: any
}

interface Conversation { 
    id: string|number, 
    type: string, 
    message: string, 
    disable?: boolean,
    loader?: boolean,
    metaData?: object|null,
}

interface ConversationData { 
    id?: string|number, 
    roleType: string,
    role: string,
    content: string,
    createdAt?: string,
    metaData?: object|null,
}