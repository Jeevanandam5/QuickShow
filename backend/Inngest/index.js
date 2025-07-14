import { Inngest } from "inngest";
import User from "../models/user.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save the user from database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event}) =>{
        const { 
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
        }=event.data

        const userdata = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + '' +last_name,
            image: image_url
        }
        await User.create(userdata) 
    }
)

// Inngest function to delete user from database
const syncUserDelete = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event}) =>{
        const {id} = event.data
        await User.findByIdAndDelete(id) 
    }
)

// Inngest function to Update user from database
const syncUserUpdate = inngest.createFunction(
    {id: 'update-user-with-clerk'},
    {event: 'clerk/user.updated'},
    async ({event}) =>{

         const { 
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
        }=event.data

        const userdata = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + '' +last_name,
            image: image_url
        }
        await User.findByIdAndUpdated(id , userdata)
    }
)





export const functions = [syncUserCreation,syncUserDelete,syncUserUpdate];