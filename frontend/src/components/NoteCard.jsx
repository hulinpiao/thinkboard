import React from 'react';
import { Link } from 'react-router';
import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const NoteCard = ({note, setNotes}) => {
  //handleDelete logic with toast： 
  // const handleDelete = (e, id) => {
  //   e.preventDefault();
  
  //   toast((t) => (
  //     <div className="flex flex-col gap-2">
  //       <span>确定要删除这条笔记吗？</span>
  //       <div className="flex gap-2">
  //         <button
  //           className="btn btn-error btn-xs"
  //           onClick={async () => {
  //             toast.dismiss(t.id);
  //             try {
  //               await deleteNote(id); // 这里调用你的删除 API
  //               toast.success('删除成功');
  //             } catch (err) {
  //               toast.error('删除失败');
  //             }
  //           }}
  //         >
  //           删除
  //         </button>
  //         <button
  //           className="btn btn-ghost btn-xs"
  //           onClick={() => toast.dismiss(t.id)}
  //         >
  //           取消
  //         </button>
  //       </div>
  //     </div>
  //   ), { duration: Infinity });
  // };
  const handleDelete = async (e, id) => {
    e.preventDefault(); //get rid of the navigation behaviour
    //当用户点击 “Cancel” 时，window.confirm(...) 会返回 false，取反后变成 true，于是 if (!window.confirm(...)) return; 会立即 return，函数在这一行就结束了，后面的 try { ... } catch { ... } 都不会执行。只有当用户点击 “OK” 时，window.confirm(...) 返回 true，取反后变成 false，if 条件不成立，函数才会继续往下走到 try...catch 里的删除逻辑。
    if(!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`)
      //update setNotes after delete
      setNotes((prev) => prev.filter(note => note._id !==id ))// get rid of the deleted one
      toast.success("note successfully deleted")
    } catch (error) {
      console.log("Error in handleDelete", error)
      toast.error("failed to delete note")
    }
  }

  return ( 
    <Link 
      to={`/note/${note._id}`}
      className='card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D]'
    >
        <div className='card-body'>
            <h3 className='card-title text-base-content'>{note.title}</h3>
            <p className='text-base-content/70 line-clamp-3'>{note.content}</p>
            <div className='card-actions justify-between items-center mt-4'>
                <span className='text-sm text-base-content/60'>{formatDate(new Date(note.createdAt))}</span>
                <div className='flex items-center gap-1'>
                    <PenSquareIcon className="size-4" />
                    <button className='btn btn-ghost btn-xs text-error' onClick={(e) => handleDelete(e, note._id)}>
                        <Trash2Icon className='size-4'/>
                    </button>
                </div>

            </div>
        </div>        
        
    </Link>
  )
}

export default NoteCard