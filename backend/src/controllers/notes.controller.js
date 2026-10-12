import {Note} from "../models/note.model.js"

export async function createNotes(req,res){
  try{
    const {title , content} = req.body;
    if(!title.trim() || !content.trim()){
      res.status(400).json({message:"all fields are required !!"});
    }
    const note = await Note.create(
      {
        title:title.trim(),
        content:title.trim()
      }
    );

    return res.status(200).json({message:"note create successfully",data:note});

  }catch(error){
    return res.status(500).json({
      message:"failed to create note",
      error:error.message
    })
  }
}

export async function getNotes(req,res){
  try{
    let {search} = req.query;
    let filter = {}
    if(search?.trim()){
      const keyword = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    };
    }

    const notes = await Note.find(filter).sort({createdAt:-1});
    res.status(200).json({
      message:"notes find successfully",
      data:notes
    })
  }catch(error){
    res.status(500).json({message:"notes not found", error: error.message})
  }
}

export async function findById(req,res){
  try{
    const id = req.params.id;
    const note = await Note.findById({where:{id}});
    if(!note){
      return res.status(401).json({
        message:"note not found"
      })
    }
    return res.status(200).json({message:"note found success",data:note})

  }catch(error){
    res.status(500).json({message:"note not found", error: error.message})
  }
}


export async function updateNotes(req,res){
  try{
    const {title,content} = req.body;
    if(!title.trim ||!content){
      return res.status(400).json({message:""})
    }
    const updates = {};
    if(title!==undefined){
      updates.title = title
    }

    if(content!==undefined){
      updates.content = content;
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,{$set:update},
      {
      new: true,
      runValidators: true,
      }
    )
    if(!note){
      return res.statu(400).json({message:""})
    }
    return res.status(200).json({message:"updated ",data:note})
  }catch(error){
    res.status(500).json({message:"note not found", error: error.message})
  }
}
export async function deleteNotes(req,res){
  try{
    const id = req.params.id;
    //find the notes
    const note = await Note.findByIdAndDelete(id);
    if(!note){
      return res.status(401).json({message:"notes not found"});
    }
    return res.status(200).json({message:"Notes deleted successfully"});
  }catch(error){
    res.status(500).json({message:"note not found", error: error.message})
  }
}
