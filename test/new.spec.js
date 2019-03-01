const newProject= require('../src/new');
describe('ysf new command',()=>{
  it('should filter files out',()=>{
    let content = `# this is comment
    fileA   # commeont
    fileB  #######
    ##########
######

#####  new FIles

`
let expected = ['fileA','fileB'];

// process
let result = newProject.filterFiles(content);

expect(result).toEqual(expected);

  })
})
