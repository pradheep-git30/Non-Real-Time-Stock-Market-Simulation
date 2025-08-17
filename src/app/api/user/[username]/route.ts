import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { UserData } from '@/lib/types';
import { Collection } from 'mongodb';

async function getCollection(): Promise<Collection<UserData>> {
    const client = await clientPromise;
    const db = client.db("stockflow"); // You can name your database here
    return db.collection<UserData>("users");
}

// GET user data
export async function GET(request: Request, { params }: { params: { username: string } }) {
    try {
        const { username } = params;
        const collection = await getCollection();
        const user = await collection.findOne({ "user.name": { $regex: new RegExp(`^${username}$`, 'i') } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// POST (create) a new user
export async function POST(request: Request, { params }: { params: { username: string } }) {
     try {
        const { username } = params;
        const collection = await getCollection();
        
        const existingUser = await collection.findOne({ "user.name": { $regex: new RegExp(`^${username}$`, 'i') } });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }
        
        const newUser: UserData = {
          user: { name: username, avatar: '' },
          wallet: 5000,
          holdings: [],
          transactions: [{
            id: new Date().toISOString(),
            type: 'deposit',
            amount: 5000,
            date: new Date().toISOString(),
          }],
          watchlist: [],
        };

        const result = await collection.insertOne(newUser);
        
        return NextResponse.json(newUser, { status: 201 });

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


// PUT (update) user data
export async function PUT(request: Request, { params }: { params: { username: string } }) {
    try {
        const { username } = params;
        const body = await request.json();
        const collection = await getCollection();

        const result = await collection.updateOne(
            { "user.name": { $regex: new RegExp(`^${username}$`, 'i') } },
            { $set: body }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
