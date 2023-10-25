const Todo = require('../models/Todo')
const Couple = require('../models/Couple')
const asyncHandler = require('express-async-handler')

const getTodosByCouple = asyncHandler(async (req, res) => {
    const { coupleId } = req.params
    if (!coupleId) return res.status(404).json({ success: false, result: 'Can not find couple' })

    const { _id } = req.user
    //Check user connected with lover
    const couple = await Couple.findOne({ $or: [{ createdUser: _id }, { loverUserId: _id }] })

    const todos = await Todo.find({ coupleId: coupleId }).populate('author', 'name')
    return res.status(200).json({
        success: todos ? true : false,
        result: todos ? todos : 'No todo found'
    })
})

const createTodo = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { coupleId } = req.params

    //Check user connected with lover
    const couple = await Couple.findOne({ $or: [{ createdUser: _id }, { loverUserId: _id }] })
    if (!couple.loverUserId) return res.status(400).json({ success: false, result: 'At the moment, you are not connetion with your lover, so you cannot use this feature' })

    let { content, type, isImportant, dueDate } = req.body
    if (!content) throw new Error('Content is required')
    if (!dueDate) dueDate = new Date()
    const todo = await Todo.create({ content, type, isImportant, author: _id, dueDate, coupleId })
    return res.status(200).json({
        success: todo ? true : false,
        result: todo ? todo : 'Can not create a new todo'
    })
})

const checkDoneTask = asyncHandler(async (req, res) => {
    const { todoId } = req.params
    const { _id } = req.user

    //Check user connected with lover
    const couple = await Couple.findOne({ $or: [{ createdUser: _id }, { loverUserId: _id }] })
    if (!couple.loverUserId) return res.status(400).json({ success: false, result: 'At the moment, you are not connetion with your lover, so you cannot use this feature' })

    const check = await Todo.findByIdAndUpdate(todoId, { completed: true })
    return res.status(200).json({
        success: check ? true : false,
        result: check ? check : 'Can not do this action'
    })

})



module.exports = {
    createTodo,
    getTodosByCouple,
    checkDoneTask
}