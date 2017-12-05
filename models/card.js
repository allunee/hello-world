var method = Card.prototype;

function Card(number, type, point) {
    this._number = number;
    this._type = type;
    this._point = point;
    this._image = this.getImage()
}

method.getNumber = function() {
    return this._number;
};
method.getType = function() {
    return this._type;
};
method.getPoint = function() {
    return this._point;
};

method.getImage = function(){
    var kq = "";
    switch(parseInt(this._number))
    {
        case 1:
            kq += "ace_of_";     break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            kq += this._number + "_of_";       break;
        case 11:
            kq += "jack_of_";           break;
        case 12:
            kq += "queen_of_";           break;
        case 13:
            kq += "king_of_";           break;
        default:
            kq += "back";            break;
    }

    switch(parseInt(this._type))
    {
        case 1:
            kq += "spades"; break;
        case 2:
            kq += "clubs"; break;
        case 3:
            kq += "diamonds"; break;
        case 4:
            kq += "hearts"; break;
        default:
            kq += ""; break;
        
    }
    return kq + ".png";
}

module.exports = Card;