var list_data;
var item_detail_index;
;(function () {

    //初始化数据
    init_data();
    //绑定事件
    bindEvent();
})();

function init_data(list_one) {

    if (list_one){
        var list=[];
        list.push(list_one);
    }
    else {
        list_data=store.get("list_data")||[];
        list=list_data;
    }
    if (list.length==0){
        return false;
    }
    var length=list.length;
    var itemHtml, $task_list = $('.task-list');
    if (length>0){
        for (var i=0;i<length;i++){
            var Nu=$('.task-item').length;
            itemHtml=renderTemplte(list[i],Nu);
            $task_list.append(itemHtml);
            if(list[i].ibsolete){
                var $checkbox= $('#checkbox'+i);
                $checkbox.parent().parent().addClass('completed').css({
                    'background':'#f6f6f6',
                    'color':'#cccccc'
                });
                $checkbox.attr('checked', 'true');
            }

        }
    }
};


function renderTemplte(data,i){
    var templeItem='<div class="task-item clearfix">' +
        '<span class="check_span pull-left"><input class="input_checkbox pull-left" id="checkbox'+i+'" type="checkbox"/><label class="lb_ck" for="checkbox'+i+'"></label></span>' +
        '<span class="task-content pull-left">'+data.content+'</span>' +
        '<span class="bt_span delelte pull-right" >删除</span>' +
        '<span class="bt_span detail pull-right">详情</span>' +
        '</div>'
    return templeItem;
}

function bindEvent() {
    var $add_taskBtn=$('.tasks .add-task button');
    var $add_taskInp=$('.tasks .add-task input');


   //绑定submit按钮的事件
    $add_taskBtn.on('addclick',function () {
       var inputVal=$add_taskInp.val()||'';

       if (inputVal){
           var item={
                  ibsolete : false,
                   content : inputVal,
                      desc : '',
                  timedata : ''
           };
           list_data.push(item)
           setList_data("list_data",list_data);
           $add_taskInp.val('');
       };
        init_data(item);
    });

    $add_taskBtn.click(function () {
        $add_taskBtn.trigger('addclick');
    });

    //键盘事件
    $('.add-task input').keyup(function (e) {
        if (e.keyCode===13){
            $add_taskBtn.trigger('addclick');
        }
    })

    // //item的委托点击事件

    $(document).on('click','.task-content',function (event) {
        event.stopPropagation();

    });

    //详情的点击事件
    $(document).on('click','.detail',function (event) {
        event.stopPropagation();
        show($('.mask'));
        show($('.task-detail'),300);

        //初始化datetimepicker
        $('.input-date').datetimepicker();

        //获取当前元素在父元素中的索引
        var index=getIndex($(this));

        item_detail_index=index;

        //进行回填内容
        re_detail(index);
    });


    //checkBox的点击事件
    $(document).on('click','.input_checkbox',function (event) {
        event.stopPropagation();
        var item=$(this).parent();
        var arr=getList_data('list_data');

        if($(this).is(':checked')){
            item.parent().addClass('completed').css({
                'background':'#f6f6f6',
                'color':'#cccccc'
            });
            arr[getIndex(item)].ibsolete=true;
        }
        else {
            item.parent().removeClass('completed').css({
                'background':'#fff',
                'color':'#cccccc'
            });
            arr[getIndex(item)].ibsolete=false;

        }
        setList_data('list_data',arr);
    });

    //detail中的内容submit
    $('.input-submit').click(function (event) {
        event.stopPropagation();

       var textareaVal = $('.desc textarea').val();
       var    texttime = $('.input-date').val();

       //获取当前的index值
       var onArr=getList_data('list_data');
        onArr[item_detail_index].desc=textareaVal;
        onArr[item_detail_index].timedata=texttime;
       //设置Textarea值
       setList_data('list_data',onArr);
        $('.desc textarea').val('');
        $('.input-date').val('');
        hide($('.mask'));
        hide($('.task-detail'),200);
    })

    //遮罩层的点击事件
    $('.mask').click(function (event) {
        event.stopPropagation();

        hide($('.mask'));
        hide($('.task-detail'),200);
    })

    //删除的点击事件
    $(document).on('click','.delelte',function (event) {

        event.stopPropagation();


        var itemParent=$(this).parent();
        //获取当前元素在父元素中的索引
        var index=getIndex($(this));

        list_data.splice(index,1);
        setList_data("list_data",list_data);

        itemParent.hide(200,function () {
            itemParent.remove();
        });
    });
}

//获取当前元素所在item在父元素的index
function getIndex($Object) {

    var itemParent=$Object.parent();
    //获取当前元素在父元素中的索引
    var index=$('.task-list div').index(itemParent);
        return index;
}
//进行回填内容
function re_detail(index) {
    var $detail    = $('.task-detail'),
        $detailCon = $detail.find('.content'),
        $detaildesc= $detail.find('.desc>textarea'),
        $detailtime=$detail.find('.input-date')

    //获取local中的内容进行回填
    var list_content=getList_data("list_data");
    $detailCon.text(list_content[index].content);
    $detaildesc.val(list_content[index].desc);
    $detailtime.val(list_content[index].timedata)

};

//show-
function show($Object,time) {
    if(!$Object){
        return false;
    }
    var time;
    time?time:0;
    $Object.show(time);
}

//hide-
function hide($Object,time) {
    if(!$Object){
        return false;
    }
    time?time:0;
    $Object.hide(time);
}

//根据key值获取localStorage的Value值
function getList_data(keyName){
    return store.get(keyName)
};
//根据键值对储存LocalStorage
function setList_data(keyName,keyVal){
    return store.set(keyName,keyVal)
};