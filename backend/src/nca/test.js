/**
 * Created by vany on 15.09.2015.
 */
const heartbeat_msg = '--heartbeat--';
const missed_heartbeats_limit = 3;
const link_not_installed = '/sign_workaround/not_installed';

/** @namespace helpers.sign_workaround.WebSocket */
genHelperNamespace(window,'helpers.sign_workaround.WebSocket');
helpers.sign_workaround.WebSocket.clientsAr = [];
helpers.sign_workaround.WebSocket.WebSocketWrapper = function(){
    var thisws = this;
    this.ws = new WebSocket('wss://127.0.0.1:13579/');
    this.state = 1;//0 - passive, 1 - active;
    this.missed_heartbeats = 0;
    this.hello_message = true;
    this.ws.onmessage = function(event){
        if(thisws.hello_message)
        {
            thisws.hello_message = false;
            return;
        }else if(event.data===heartbeat_msg)
        {
            thisws.pong();
            return;
        }
        var data = JSON.parse(event.data);
        if(data.errorCode!=null && data.errorCode!='NONE')
        {
            if (typeof thisws.onerror === 'function') {
                thisws.onerror(data.errorCode);
                thisws.close();
            }
        }
        else
        {
            if (typeof thisws.onmessage === 'function') {
                thisws.onmessage(data);
                thisws.close();
            }
        }
    };

    this.ping = function(){
        try {
            thisws.missed_heartbeats++;
            if (thisws.missed_heartbeats >= missed_heartbeats_limit)
                throw new Error("Too many missed heartbeats.");
            thisws.ws.send(heartbeat_msg);
        } catch (e) {
            clearInterval(thisws.ping_interval);
            thisws.ws.close();
            if (typeof(thisws.onerror) === 'function') {
                thisws.onerror(998);
            }

        }
    };
    this.pong = function(){
        thisws.missed_heartbeats = 0;
    };

    this.ws.onopen = function(){
        //this.ping_interval = setInterval(thisws.ping,2000);
    };
    this.ws.onerror = function(event){
        console.log(event);
        if(typeof(thisws.onerror)=="function"){
            thisws.onerror(999);
        }
    };

    this.close = function(){
        this.onmessage = null;
        helpers.sign_workaround.WebSocket.setClient(this);
    };
    this.send = function(data,onmessage){
        if(typeof(onmessage)!=='function')
            throw new Error('InvalidArgumentException: onmessage');
        this.onmessage = onmessage;
        var delay_counter = 0;
        var delay_send = function(wsw){
            delay_counter++;
            if(delay_counter>20){
                if (typeof(wsw.onerror) === 'function') {
                    wsw.onerror(997);
                }
                return;
            }
            if(wsw.ws.readyState==0 || wsw.hello_message){
                setTimeout(delay_send,250,wsw);
            }else if(wsw.ws.readyState==1){
                thisws.hello_message = false;
                wsw.ws.send(JSON.stringify(data));
            }else{
                if (typeof(wsw.onerror) === 'function') {
                    wsw.onerror({message:'Соединение сброшено.'});
                }
            }
        };
        if(thisws.ws.readyState==1) {
            thisws.hello_message = false;
            thisws.ws.send(JSON.stringify(data));
        }else{
            delay_send(this);
        }
    };
};
helpers.sign_workaround.WebSocket.setClient = function(client){
    this.clientsAr.push(client);
};
helpers.sign_workaround.WebSocket.getClient = function(){
    var lastClient = this.clientsAr.pop();
    if(lastClient!==undefined)
    {
        if(lastClient.ws.readyState==2 || lastClient.ws.readyState==3)
            return helpers.sign_workaround.WebSocket.getClient();
        return lastClient;
    }
    return new helpers.sign_workaround.WebSocket.WebSocketWrapper();
};
helpers.sign_workaround.WebSocket._check_accessibility = false;
helpers.sign_workaround.WebSocket.check_accessibility = function(){
    var ws = helpers.sign_workaround.WebSocket.getClient();
    var interval_id;
    ws.onerror = function(error_id){
        switch (error_id) {
            case "MODULE_NOT_FOUND":
                document.location.assign(urlLangGen(link_not_installed)+'?type=2');
                break;
            case 997:
            case 999:
                document.location.assign(urlLangGen(link_not_installed));
                break;
            default :
                alert(helpers.sign_workaround.form_sign_helper.get_error_text(999))
                return;
        }
    };
    ws.send(
        {
            "module":"NURSign"
            ,"type":"version"
        }
        ,function(result){
            if(result.result == null || result.result.version == null || result.result.version!="1.0.0")
                document.location.assign(urlLangGen(link_not_installed));

            helpers.sign_workaround.WebSocket._check_accessibility = true;
        }
    )

};
if(!document.not_checked_sw_accessibility){
    $(function(){
        helpers.sign_workaround.WebSocket.check_accessibility();
    });
}
/** @namespace helpers.sign_workaround.files */
genHelperNamespace(window,'helpers.sign_workaround.files');
helpers.sign_workaround.files._file_token = null;
helpers.sign_workaround.files.get_token = function () {
    if(helpers.sign_workaround.files._file_token==null)
    {
        helpers.sign_workaround.files._file_token = $('.form_uploading_block:first').data('file-token');
    }
    return helpers.sign_workaround.files._file_token;
};
helpers.sign_workaround.files.sign_and_upload = function(callback,error_callback,url){
    if(typeof(callback)!=='function')
    {
        throw new Error('Argument callback is not a function');
    }
    var ws = helpers.sign_workaround.WebSocket.getClient();
    ws.onerror = error_callback;
    ws.send(
        {
            "module":"NURSign"
            ,"type":"file"
            ,"token":this.get_token()
            ,"url_upload":url
        }
        ,function(result){
            if(result.error_code==null || result.error_code=="NONE")
            {
                callback(result.result);
                return;
            }
            error_callback(result.error_code);
        }
    )
};
/** @namespace helpers.sign_workaround.form_sign_helper */
genHelperNamespace(window,'helpers.sign_workaround.form_sign_helper');
helpers.sign_workaround.form_sign_helper.checkStatusIntervalID = null;
helpers.sign_workaround.form_sign_helper.add_file_block = function (target){
    form_uploading_block = $(target).closest('.form_uploading_block');
    var form_uploading_container_text = form_uploading_block.find('.form_upload_container')[0].outerHTML;
    var new_block = $(form_uploading_container_text);
    new_block.find('.clearelement').empty();
    new_block.find('input').val('');
    new_block.find('.file_status').hide();
    $(target).before(new_block);
    new_block.show();
    new_block.find('.sign_upload').trigger('click');
};
helpers.sign_workaround.form_sign_helper.check_statuses = function(group_id){
    var all_items;
    if(typeof group_id == "undefined") {
        all_items = $('.file_status_ext');
    }
    else
    {
        all_items = $('.form_uploading_block[data-file-group-id="'+group_id+'"] .file_status_ext');
    }
    if(all_items.length==0)
    {
        //return false; kirk: нужно возвращать null. Может случится так, что на форме удалили все файлы...
        return null;
    }
    var status_ok = all_items.filter('.check_file_status_ok');
    if(all_items.length!= status_ok.length)
    {
        return false;
    }
    else
    {
        return true;
    }
};
helpers.sign_workaround.form_sign_helper.check_status_tmp = function (){
    var check_selector = $('.check_file_status_progress');

    if(check_selector.length==0)
    {
        clearInterval(helpers.sign_workaround.form_sign_helper.checkStatusIntervalID);
        helpers.sign_workaround.form_sign_helper.checkStatusIntervalID = null;
        return;
    }
    var reqArray = {};
    check_selector.each(function (idx,elm){
        reqArray[idx] = elm.attributes['data-file-id'].value;
    });

    $.ajax({
        url:"/files/check_status/",
        type:"POST",
        dataType:"json",
        cache: false,
        data:{file_id_ar:reqArray},
        success:function(result)
        {
            for(var idx in result)
            {
                helpers.sign_workaround.form_sign_helper.update_status(idx,result[idx]);
            }
        },
        error:function (error){
            console.log(error);
        }
    });
};
helpers.sign_workaround.form_sign_helper.generate_input = function (form){
    var html = "";
    var status_ok = $('.check_file_status_ok');
    if(status_ok.length==0)
    {
        return false;
    }
    $('.userfile-class').remove();
    status_ok.each(function (idx,item){
        var jitem = $(item);
        html+= '<input type="hidden" class="userfile-class" name="userfile['+jitem.data('file-group-id')+'][]" value="'+$(item).data('file-id')+'">';
    });
    $(form).append(html);
    return true;
};
helpers.sign_workaround.form_sign_helper.get_error_text = function (error_id) {
    switch (error_id) {
        case 1 : return  "Отменено пользователем";
        case 2 : return  "Превышен лимит на размер файла";
        case 3: return   "Ошибка отправки файла на удаленный сервер";
        case 4: return   "Файла для подписи и отправки не найден";
        case 5: return   "Ошика проверки файла на сервере";
        case 6: return   "ОШИБКА";
        case 7: return   "Ошибка получения подписи";
        case 8: return   "Ошибка при выборе сертифика для подписи";
        case 9: return   "Ошибка подписания XML";
        case 10: return   "Ошибка при подписании";
        case 11: return   "Ошибка при получении файла";
        case 12: return   "Ошибка при получении HASH данных";
        case 13: return   "Ошибка при формировании подписи";
        case 14: return  "Недопустимы адрес URL";
        case 15: return  "Файл не найден";
        case 17: return "Неправильный пароль"
        case 997: return "Не удалось подключиться к прослойке";
        case 998: return "Соединение с прослойкой неожиданно было завершено";
        case 999: return "Возникла ошибка при подписании файла. Обратитесь к администратору системы."
        default : return "Возникла ошибка, обратитесь к администратору системы";
    }
};
helpers.sign_workaround.form_sign_helper.remove_file = function(target){
    var form_uploading_container = $(target).closest('.form_upload_container');
    var form_uploading_block = form_uploading_container.parent();
    var form_upload_containers = form_uploading_block.find('.form_upload_container');
    if(form_upload_containers.length>1)
    {
        form_uploading_container.remove();
    }
    else
    {
        var form_upload = form_uploading_container.find('.form_upload');
        form_upload.find("input").val('');
        var file_status = form_uploading_container.find('.file_status');
        form_uploading_block.find('.clearelement').empty();
        form_upload.show();
        form_upload.find('.upload_button').hide();
        file_status.hide();
    }
};
helpers.sign_workaround.form_sign_helper.show_status_form = function (form,file_id){
    $(form).hide();
    var status_container = $(form).siblings('.file_status').show();
    status_container.find('.file_status_av').append('<div class="check_file_status_row_progress"></div>');
    status_container.find('.file_status_sign').append('<div class="check_file_status_row_progress"></div>');
    status_container.find('.file_final_status').append('<div class="check_file_status_progress file_status_ext" data-file-id="'+file_id+'"></div>');//<div class="check_file_status_row_progress"></div>
    status_container.find('.cell-filename').append('<a target="_blank" href="/files/download_file/'+file_id+'/">'+form.file_name.value+'</a><br>'+form.file_size.value + ' байт');

    this.start_check_status();
};
helpers.sign_workaround.form_sign_helper.sign_raw = function(settings,type,data){
    if(settings.cert_type == null || settings.cert_type=='')
    {
        settings.cert_type = 'GY';
    }
    if(typeof settings.data_signed_callback != 'function')
    {
        console.log('Обязательная функция возврата не была определена');
        alert('Возникла ошибка. Обратитесь к администратору системы.');
        return;
    }
    var message = {
        "module":"NURSign",
        "type":type,
        "data":data
    };
    if(settings.source != null)
    {
        message.source = settings.source;
    }
    else
    {
        message.source = 'local';
    }
    var ws = helpers.sign_workaround.WebSocket.getClient();
    ws.onerror = function(error_id){
        if(error_id=='1')
        {
            $(settings.block_element).unblock();
            settings.user_interaction();
            return;
        }
        if(settings.block_element != null)
        {
            $(settings.block_element).unblock();
        }
        alert(helpers.sign_workaround.form_sign_helper.get_error_text(error_id));
        settings.user_interaction();
    };
    ws.send(
        message
        ,function(result){
            if(settings.block_element != null)
            {
                $(settings.block_element).unblock();
            }
            settings.data_signed_callback(result.result);
        }
    );
};
helpers.sign_workaround.form_sign_helper.sign_upload = function(target){
    $(target.form).block();
    helpers.sign_workaround.files.sign_and_upload(
        function(result){
            $(target.form).unblock();
            if (result.validation_error) {
                alert(result.error_message);
                return;
            }
            if (result.error != null && result.error != 0) {
                alert(helpers.sign_workaround.form_sign_helper.get_error_text(result.error));
                return;
            }
            var file_id = parseInt(result.file_id);
            target.form.file_name.value = result.file_name;
            target.form.file_size.value = result.file_size;
            helpers.sign_workaround.form_sign_helper.show_status_form(target.form,result.file_id);
        }
        ,function(error_id){
            $(target.form).unblock();
            alert(helpers.sign_workaround.form_sign_helper.get_error_text(error_id));
        }
        ,target.form.action
    );
};
helpers.sign_workaround.form_sign_helper.sign_multitext = function(settings){
    if(settings.text_ar == null)
    {
        console.log('Обязательная струтура для множественного подписания текста не была передана.');
        alert('Возникла ошибка. Обратитесь к администратору системы.');
        return;
    }
    var data;
    if(Array.isArray( settings.text_ar)){
        data = {}
        for (var i = 0; i < settings.text_ar.length; ++i)
            data[i] = settings.text_ar[i];
        return rv;
    }
    else{
        data = settings.text_ar;
    }
    helpers.sign_workaround.form_sign_helper.sign_raw(settings,'multitext',data);
};
helpers.sign_workaround.form_sign_helper.sign_uploaded_file = function (target){
    var target = $(target);
    var url = target.data('url');
    var file_identifier = target.data('file-identifier');
    var form_id = target.data('form-id');
    var block_element = target.parents('.add_signature_block').get(0);
    var ws = helpers.sign_workaround.WebSocket.getClient();
    ws.onerror = function(error_id){
        $(block_element).unblock();
        if(error_id==1)
            return;
        alert(helpers.sign_workaround.form_sign_helper.get_error_text(error_id));
    };
    ws.send(
        {
            "module": "NURSign",
            "type": "binary",
            "upload_url": url,
            "source": "remote"
        }
        ,function(result){
            $('#'+form_id).append('<input type="hidden" class="ssignature" name="signature'+(file_identifier?'['+file_identifier+']':'')+'" value="'+result.result+'">');
            if(typeof(target[0].afterGenSignEvent)== 'function')
            {
                target[0].afterGenSignEvent();
            }
            $(block_element).unblock();
        }
    );
};
helpers.sign_workaround.form_sign_helper.signResultCrutch = function (result){
    var newResult = {};
    for(idx in result.sign_data)
    {
        for(idx2 in result.sign_data[idx])
        {
            newResult[idx2] = result.sign_data[idx][idx2];
        }
    }
    result.sign_data[0] = newResult;
};
helpers.sign_workaround.form_sign_helper.start_check_status = function (){
    if(this.checkStatusIntervalID == null)
    {
        this.checkStatusIntervalID = setInterval(this.check_status_tmp,10000);
    }
};
helpers.sign_workaround.form_sign_helper.update_status = function (index,result){
    var main_status = $('.check_file_status_progress[data-file-id=' + index + ']');
    var status_table = main_status.closest('table');
    var valid = 0;
    var invalid = 0;
    if(result.av.need==1)
    {
        if(result.av.check==1)
        {
            status_table.find('.cell-av .check_file_status_row_progress').replaceWith('<div class="check_file_status_row_ok">'+result.av.text+'</div>');
            valid += 1;
        }
        else if(result.av.check>1)
        {
            console.log(result.av);
            status_table.find('.cell-av .check_file_status_row_progress').replaceWith('<div class="check_file_status_row_fail">'+result.av.text+'</div>');
            invalid += 1;
        }
    }
    else
    {
        status_table.find('.cell-av .check_file_status_row_progress').replaceWith('<div class="check_file_status_row_skip">'+result.av.text+'</div>');
        valid += 1;
    }

    if(result.signature.need==1)
    {
        if(result.signature.check==1)
        {
            status_table.find('.cell-sign .check_file_status_row_progress').replaceWith('<div class="check_file_status_row_ok">'+result.signature.text+'</div>');
            valid += 1;
        }
        else if(result.signature.check>1)
        {
            console.log(result.signature);
            status_table.find('.cell-sign .check_file_status_row_progress').replaceWith('<div class="check_file_status_row_fail">'+result.signature.text+'</div>');
            invalid += 1;
        }
    }
    else
    {
        status_table.find('.cell-sign .check_file_status_row_progress').replaceWith('<div class="check_file_status_row_skip">'+result.signature.text+'</div>');
        valid += 1;
    }

    if(valid==2)
    {
        main_status.replaceWith('<div class="check_file_status_ok file_status_ext" data-file-group-id="'+main_status.closest('.form_uploading_block').data('file-group-id')+'" data-file-id="'+index+'"></div>');
        if(form_sign_helper.file_status_ok_callback != null)
        {
            form_sign_helper.file_status_ok_callback();
        }
    }
    if(invalid>0)
    {
        main_status.replaceWith('<div class="check_file_status_fail file_status_ext" data-file-id="'+index+'"></div>');
    }
};
helpers.sign_workaround.form_sign_helper.sign_xml = function(xml,settings){
    helpers.sign_workaround.form_sign_helper.sign_raw(settings,'xml',xml);
};
helpers.sign_workaround.form_sign_helper.convert_sign_xml_result = function(result){
    var parser;
    var xmlDoc;
    if (window.DOMParser)
    {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(result, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(result);
    }
    var tags = xmlDoc.getElementsByTagName('ds:X509Certificate');
    if(tags.length==0)
    {
        tags = xmlDoc.getElementsByTagName('X509Certificate');
        if(tags.length==0)
            throw new Error('Tags with certificate not found');
    }
    return {
        sign_data:{
            sign_value:result
            ,cert64:tags[0].textContent
        }
    };
};
form_sign_helper = helpers.sign_workaround.form_sign_helper;

function sign_multiple_uploaded_file(callback)
{
    //получим данные
    var currentTarget = $(event.target);
    var settings = {
        'files_structure':JSON.parse($(currentTarget.data('file-structure-source')).html()),
        'block_element': $(currentTarget.data('block-element')),
        'cert_type':currentTarget.data('cert_type'),
        'data_signed_callback':callback
    };
    form_sign_helper.sign_multiple_uploaded_file(settings);
}

function sign_uploaded_file(jEvent)
{
    var target = $(jEvent.currentTarget);
    var url = target.data('url');
    var file_identifier = target.data('file-identifier');
    var form_id = target.data('form-id');
    var block_element = target.parents('.add_signature_block').get(0);
    form_sign_helper.sign_uploaded_file(url,block_element,function(signature){
        $('#'+form_id).append('<input type="hidden" name="signature'+(file_identifier?'['+file_identifier+']':'')+'" value="'+signature+'">');
        if(target[0].afterGenSignEvent != null)
        {
            target[0].afterGenSignEvent();
        }
    });
}

function generate_file(upload_form)
{
    $.ajax({
        url:upload_form.action,
        type:"POST",
        dataType:"json",
        processData:false,
        contentType:false,
        data: new FormData(upload_form),
        success:function(result){
            if (result.status == 1)
            {
                var download_link = result.link;
                var file_id = parseInt(result.file_id);
                if (file_id > 0 && download_link.length > 0)
                {
                    add_input_file_id(upload_form,file_id);
                    add_input_download_link(upload_form,download_link);
                    helpers.signature.form_helper.sign_uploaded_file(upload_form);
                }
            }
        },
        error:function(error){
            console.log(error);
            alert("Произошла ошибка при отправке файла на сервер");
        }
    });
}

$(function(){
    $(document).on("click",".generate_button",function(jEvent) {
        generate_file(jEvent.currentTarget.form);
    });

    $(document).on("click",".sign_button",function(jEvent) {
        sign_file(jEvent.currentTarget.form);
    });
});
