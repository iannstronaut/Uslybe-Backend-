const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient()

async function getUser( req, res ){
    try {
        const user = await db.user.findMany({
            select:{
                username:true,
                friend:{
                    select:{
                        friend:{
                            select:{
                                username: true
                            }
                        }
                    }
                }
            }
        }) 
        res.status(200).json({message:"Data Berhasil Diambil", data: user})
    } catch (error) {
        res.status(500).json({
            errors: error.message
        });
    }
}

async function createUser( req, res ){
    try {
        const { username, password, image} = req.body

        const user = await db.user.create({
            data:{
                username: username,
                password: password,
                image: image
            }
        })

        res.status(200).json({ message:"Data berhasil Dibuat", data: user})
    } catch (error) {
        res.status(500).json({ message: "Terjadi Kesalahan", error: error.message })
    }
}

async function addFriends( req,res ){
    try {
        const { userId, friendsId } = req.body
        const user1 = await db.user.findUnique({
            select: {
                id: true
            },
            where: { username: userId }
        });
        
        const user2 = await db.user.findUnique({
            select: {
                id: true
            },
            where: { username: friendsId }
        });
        const friend = await db.friend.create({
            data:{
                user: {
                    connect: { id: user1.id }
                },
                friend: {
                    connect: { id: user2.id }
                }
            }
        })
        const friendadd = await db.friend.create({
            data:{
                user: {
                    connect: { id: user2.id }
                },
                friend: {
                    connect: { id: user1.id }
                }
            }
        })
        res.status(200).json({message:"Data Berhasil Dibuat", data: {friend,friendadd}})
    } catch (error) {
        res.status(500).json({
            message: "Terjadi Kesalahan",
            errors: error.message
        });
    }
}

async function deleteUser( req, res ){
    try {
        const {userId} = req.body
        const user = await db.user.findUnique({
            where:{
                username: userId
            }
        })
        const delFriend = await db.friend.deleteMany({
            where:{
                userId: user.id
            }
        })

        const deluser = await db.user.delete({
            where:{
                id: user.id
            }
        })
        res.status(200).json({message: "Data berhasi Dihapus", data: user})
    } catch (error) {
        res.status(500).json({message:"Terjadi Kesalahan", error: error.message})
    }
}

async function updateuser( req, res ){
    try {
        const { oldUser, newUser } = req.body
        const data = await db.user.findUnique({
            where:{
                username: oldUser
            }
        })

        if(!data){
            return res.status(404).json({message:"Data tidak ditemukan"})
        }
        
        const updated = await db.user.update({
            data:{
                username: newUser
            },
            where:{ id: data.id }
        })
    
        res.status(200).json({message: "Data berhasil diubah", data: updated})
    } catch (error) {
        res.status(500).json({message: "Terjadi Kesalahan", error: error.message})
    }

}
module.exports = { getUser, createUser, addFriends, deleteUser, updateuser }