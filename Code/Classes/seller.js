var Seller = class
{
    constructor(userid, username, password, email, type_flag)
    {
        this.username = username;
        this.password = password;
        this.email = email;
        this.flag = type_flag;
        this.userid = userid;
    }
};

exports.Seller = Seller;