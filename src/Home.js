import React from 'react';

class Home extends React.Component{
   /* constructor(){
        super();
        this.state = {
            arr: {}
        };
        this.get = this.get.bind(this);
        var testjson = {}
    }
    get(){
        $.ajax({
            type:'get',
            url:'http://192.168.199.196/CaiQiSuo_PHP/api/fore-end/getHomePageList.php',
            success:function(res){
                // for(var index in res) {
                //     console.log(index ,":", res[index]);
                // }
                /!* this.testjson = res;
                 console.log(this.testjson.message);*!/
                var List = JSON.parse(res).message;
                console.log(List);
            }
        })
    }*/
    render(){
        return(
            <div style={{
                backgroundColor:'white',
                width:'100%',
                float:'left'
            }}>
            </div>

        );
    }
}

export default Home;