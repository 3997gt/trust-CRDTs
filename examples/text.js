const Automerge = require('automerge')

//initial state of Text
var state =  Automerge.from({
        text: new Automerge.Text("Text ....."),
      });

//edit history ..
const { edits, finalText } = require('./editing-trace') 
/**
  [0, 0, "\\"], sequence, .. char(,..., edge_id, trust_level?)
  [1, 0, "d"],
  [2, 0, "o"],
  [3, 0, "c"],
  ...
**/

const start = new Date()
//Apply Changes
for (let i = 0; i < 100; i++) {//edits.length
//  if (i % 1000 === 0) console.log(`Processed ${i} edits in ${new Date() - start} ms`)
  state = Automerge.change(state, doc => {
    if (edits[i][1] > 0) doc.text.deleteAt(edits[i][0], edits[i][1])
    if (edits[i].length > 2) doc.text.insertAt(edits[i][0], ...edits[i].slice(2))
  })
}
//Final States
for (let char of state.text) console.log(char) // iterates over all characters

