const Member = require('../models/odm/subscriptionsDB/members');

module.exports.displayMembers = async (req,res,next) =>
{
    try
    {
        const members = await Member.find();
        res.json(members);
    } catch(err)
    {
        res.status(500).json({ message: err.message});
    }
}

module.exports.displayMember= async (req,res,next) =>
{
    try
    {
        member = await Member.findById(req.params.id);
        if(member == null)
        {
            return res.status(404).json({message: 'Cannot find this member'});
        }
        res.json(member);
    } catch(err)
    {
        return res.status(500).json({message: err.message});
    }
}

module.exports.addMember = async (req,res,next) =>
{
    const member = new Member({
        name: req.body.name,
        email: req.body.email,
        city: req.body.city
    });

    try
    {
        const newMember = await member.save();
        res.status(201).json(newMember);
    } catch(err)
    {
        res.status(400).json({message: err.message })
    }
}

module.exports.editMember = async (req,res,next) =>
{
    try
    {  
        const member = await Member.findById(req.params.id);
        if(member == null)
        {
            return res.status(404).json({message: 'Cannot find this member'});
        }
        member.name = req.body.name,
        member.email = req.body.email,
        member.city = req.body.city
        const updatedMember = await member.save();
        res.status(200).json(updatedMember);
    } catch(err)
    {
        return res.status(500).json({message: err.message});
    }
}

module.exports.deleteMember = async (req,res,next) =>
{
    try
    {
        const member = await Movie.findById(req.params.id);
        await member.remove();
        res.json({message: 'Deleted member'});
    } catch(err)
    {
        res.status(500).json({message :err.message});
    }
}