
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Collection } from 'mongodb';

interface Feedback {
    username: string;
    subject: string;
    message: string;
    date: Date;
}

async function getCollection(): Promise<Collection<Feedback>> {
    const client = await clientPromise;
    const db = client.db("stockflow");
    return db.collection<Feedback>("feedback");
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, subject, message } = body;

        if (!username || !subject || !message) {
            return NextResponse.json({ message: "Missing required fields (username, subject, message)." }, { status: 400 });
        }

        const collection = await getCollection();
        
        const newFeedback: Feedback = {
          username,
          subject,
          message,
          date: new Date(),
        };

        await collection.insertOne(newFeedback);
        
        return NextResponse.json({ message: "Feedback submitted successfully" }, { status: 201 });

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
