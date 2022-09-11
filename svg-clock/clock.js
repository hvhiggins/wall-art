var scale = 600
var draw = SVG().addTo('body').size(scale, scale)

function handcenter(deg){
    x = (Math.cos(deg*Math.PI/180 -Math.PI/2)+2)/4 * scale 
    y = (Math.sin(deg*Math.PI/180 -Math.PI/2)+2)/4 * scale 
    return {'x': x, 'y': y}
}

hourstransform = () =>{
    var d = new Date()
    var hours = d.getHours()
    var deg = hours % 12 / 12 * 360;
    var transform = {
        rotate: deg,
        positionX: handcenter(deg).x,
        positionY: handcenter(deg).y
    }
    return transform
}

minutetransform = () => {
    var d = new Date()
    var minutes = d.getMinutes()
    var deg = minutes / 60 * 360;
    var transform = {
        rotate: deg,
        positionX: handcenter(deg).x,
        positionY: handcenter(deg).y
    }
    return transform
}

secondstransform = () => {
    var d = new Date()
    var seconds = d.getSeconds()
    console.log(seconds)
    var deg = seconds / 60 * 360;
    transform = {
        rotate: deg,
        positionX: handcenter(deg).x,
        positionY: handcenter(deg).y}
    return transform
}

var base = draw.circle(scale).attr({ fill: '#333' })

var center = draw.circle(scale/23).attr({fill: 'pink', cx: scale/2, cy: scale/2})

var hourhand = draw.rect(scale/20,scale/2.2).attr({fill: 'white'})
hourhand.transform(hourstransform())

var minutehand = draw.rect(scale/25,scale/2.3).attr({
    fill: 'blue', 'fill-opacity': '.7'})
minutehand.transform(minutetransform())

var secondhand = draw.rect(scale/40,scale/2.3).attr({
    fill: 'red', 'fill-opacity': '.5'})
secondhand.transform(secondstransform())

setInterval(() => {
    hourhand.animate().transform(hourstransform())
    minutehand.animate().transform(minutetransform())
    secondhand.animate().transform(secondstransform())
},1000)

