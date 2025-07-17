export const getroomId = (req,res,next) => {
    const sender = req.id
    const receiver = req.params.id

    if (!sender || !receiver) {
      return res.status(400).json({ error: 'sender and receiver id not received' });
    }

    req.room = [sender, receiver].sort().join('_')

    next();
}
