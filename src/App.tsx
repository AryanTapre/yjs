/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'

import "react-quill/dist/quill.snow.css";
import * as Y from 'yjs';
import Quill from 'quill';
import { useEffect, useRef } from 'react';
import { QuillBinding } from 'y-quill';
import {WebsocketProvider} from 'y-websocket'
import QuillCursors from 'quill-cursors';



function App() {
  const quillRef = useRef(null);

  useEffect(() => {
    Quill.register("modules/cursors",QuillCursors);

    if(quillRef.current) {
       const quill = new Quill(quillRef.current,{
        modules:{
          cursors: true,
          toolbar:[
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'list': 'check' }],
            [{ 'font': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }], 
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['link', 'image','video', 'formula'],
            [{'color':[]},{'background':[]}],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],   
            [{ 'align': [] }],                      
          ],
          history: {
            // Local undo shouldn't undo changes
            // from remote users
            userOnly: true
          }
        },
        theme:"snow"
       })

      console.log(quill);
      console.log(quillRef.current);

      const ydoc = new Y.Doc();
      const ytext = ydoc.getText('quill');
      const provider = new WebsocketProvider('wss://demos.yjs.dev','quill-demo-room',ydoc);

  
       ytext.observe(event => {
        console.log("delta:",event.changes);
        
       })

       console.log("client id: "+ydoc.clientID);
       

      const awareness = provider.awareness;
      

      awareness.setLocalStateField('user',{
        name:'aryan tapre',
        color:'#ffb61e',
        email:"taprearyan7@gmail.com"
      })

    
      //@ts-expect-error changes 

      // awareness.on("change",changes => {
      //   console.log("changes: "+JSON.stringify(changes));
      // })

      // awareness.on("update",function ({added, updated, removed}){
      //   console.log(`updates =>
      //                added: ${added},
      //               updated: ${updated},
      //               removed: ${removed}
      //   `);
        
      // })

      // making local client offline
     // awareness.setLocalState(null);

      const binidng = new QuillBinding(ytext,quill,awareness);
    }

  },[])

  return (
    <>
      <div ref={quillRef}></div>

    </>
  )
}

export default App;
