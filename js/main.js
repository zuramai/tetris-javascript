const canvas = document.getElementById('canvas');

const tetris = new Tetris({
    el: canvas,
    width: 860,
    height: 720,
    tetrominoes: [
        [Z,"red"],
        [S,"green"],
        [T,"yellow"],
        [O,"blue"],
        [L,"purple"],
        [I,"cyan"],
        [J,"orange"]
    ]
})
tetris.render();