//<script src="<%= baseUrl %>javascripts/userview.js"></script>....>>>call from here
function operateFormatter(value, row, index) {
    if(row.status === 1){
    return [
        '<a class="btn btn-primary" href="'+baseUrl+'users/edit/'+ row._id + '"users>edit</a>  ',
        '<a href="'+baseUrl+'" class="btn btn-danger delete" data-id="'+row._id +'">Delete</a>'
    ].join('');}
    else{

        return [
            '<a class="btn btn-primary" href="'+baseUrl+'users/edit/'+ row._id + '"users>edit</a>  '
        ].join('');

    }
}

function actdeact(value, row, index) {
    if(row.status === 1){
    return [
       '<p>active</p>'
    ].join('');}
    else{
        return [
            '<p>inactive</p>'
        ].join('');
    }
}

$(function () {
    //ajax button delete and change color*********************************************************{
    $(document).on("click", ".delete", function (e) {//e is default event...ie..here button pressed event
        e.preventDefault();//prevent default values such as link path....
        var thisObj = this;
        var id = $(this).data("id");
        if (confirm("Are you sure?")) {
            $.ajax({
                url: baseUrl + 'users/ajax/delete',
                type: 'POST',
                data: { id: id },
                dataType: 'JSON',
                success: function (data) {
                    if(data.success === 1) {
                        $(thisObj).parent().siblings('.change')//parent <td> ...siblings..<td>..<td>...
                        .html("inactive")
                        .removeClass("btn-success")//remove class
                        .addClass("btn-danger");//add class
                        $(thisObj).hide();//delete button
                    }
                },
                error: function () {
                }
            })
        }
    })
    //***********************************************************************************ajax button }
    //ajax table view*********************************************************************{
    // function getUsers(){
    //     $.ajax({
    //         url: baseUrl + 'users/ajaxget-users',
    //         type: 'GET',
    //         dataType: 'JSON',
    //         success: function(data){
    //             if(data.success === 1) {
    //                 var html = "";
    //                 data.result.forEach(function(u){
    //                     var statusHtml = '<td></td>';
    //                     var deleteHtml = '';
    //                     if(u.status === 0){
    //                         statusHtml = '<td class="btn-danger change">inactive</td>';
    //                     } else {
    //                         statusHtml = '<td class="btn-success change">active</td>';
    //                     }
    //                     if(u.status === 1){ 
    //                         deleteHtml += '<a href="#" class="btn btn-danger delete" data-id="'+ u._id+'">Delete</a>';
    //                     }
    //                     html += '<tr>'+
    //                                 '<td>'+u.name+'</td>'+
    //                                 '<td>'+u.email+'</td>'+
    //                                 '<td>'+u.date+'</td>'+
    //                                 statusHtml +  
    //                                 '<td>'+
    //                                 '<a href="'+baseUrl+'users/edit/'+ u._id + '" class="btn btn-success">Edit</a>'+
    //                                 deleteHtml + 
    //                                 '</td>'+
    //                             '</tr>';
    //                 });
    //                 $("#ajaxdata").html(html);//table id
    //             }
    //         }
    //     })
    // }
    //ajax table view end*************************************************************************
    //getUsers();
   

})