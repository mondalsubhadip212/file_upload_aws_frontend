$(document).ready(()=>{

    // updating tables
    function tabledata(data){
        let html = ``
        $.each(data,(index,value)=>{
            html +=`
            <tr>
                <td>${index+1}</td>
                <td>${value['filename']}</td>
                <td>${value['date']}</td>
            </tr>
            `
        })
        $('#tablebody').html(html)
    }

    // gtting list of files using get request
    function getfiles(){
        let ajax = $.ajax(server['fileupload'],{
            method: 'get'
        })
        $("#waiting").html(
            `
            getting files please wait
            `
        )
        ajax.done((msg)=>{
            $("#waiting").html(
                `
                `
            )
            if(msg.success){
                $("#success").html(
                    `
                    ${msg.success}
                    `
                )
                tabledata(msg.data)
            }
            else{
                $("#warning").html(
                    `
                    ${msg.error}
                    `
                )
            }
        })

        ajax.fail((msg)=>{
            $("#waiting").html(
                `
                `
            )
            $("#warning").html(
                `
                something went wrong while retriving files
                `
            )
        })
    }

    // uploading files to s3
    function fileupload(){
        $('#fileupload').on("click",()=>{
            $("#warning").html(
                `
                `
            )
            $("#success").html(
                `
                `
            )
            $("#waiting").html(
                `
                `
            )           
            let file = $("#customFile")[0].files[0]
            if(file != undefined){
                if(file.type == "image/jpeg" || file.type == "image/jpeg"){
                    if(file.size <= 1000*1000*5){
                        let fd = new FormData()
                        let dt = new Date()
                        let current_date = `${dt.getDate()}-${dt.getMonth()+1}-${dt.getFullYear()}`
                        fd.append("file",file)
                        fd.append("date",current_date)
                        let ajax = $.ajax(server['fileupload'],{
                            method: "post",
                            data: fd,
                            processData: false,
                            contentType: false,
                        })
                        $("#waiting").html(
                            `
                            wait while uploading the file to s3
                            `
                        )  
                        ajax.done((msg)=>{
                            $("#waiting").html(
                                `
                                `
                            )  
                            if(msg.success){
                                $("#success").html(
                                    `
                                    ${msg.success}
                                    `
                                )
                                tabledata(msg.data)
                            }
                            else{
                                $("#warning").html(
                                    `
                                    ${msg.error}
                                    `
                                )
                            }
                        })
                        ajax.fail((msg)=>{
                            $("#waiting").html(
                                `
                                `
                            )  
                            $("#warning").html(
                                `
                                something went wrong :(
                                `
                            )
                        })
                    }
                    else{
                        $("#warning").html(
                            `
                            file must be within 5 MB
                            `
                        )
                    }
                }
                else{
                    $("#warning").html(
                        `
                        only .jpeg and .png file supported
                        `
                    )
                }
            }
            else{
                $("#warning").html(
                    `
                    file not selected
                    `
                )
            }
        })
    }

    // server url
    const server_url = "https://crabsnilawstest.herokuapp.com"
    const server = {
        "fileupload" : `${server_url}/fileupload`
    }

    getfiles()
    fileupload()
})