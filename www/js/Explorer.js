var Explorer = (function () {
    function Explorer() {
		 this.root = null; // File System this.root variable
		 this.currentDir = null; // Current DirectoryEntry listed
		 this.parentDir = null; // Parent of the current directory
		 this.activeItem = null; // The clicked item
		 this.activeItemType = null; // d-directory, f-file
		 this.clipboardItem = null; // file or directory for copy or move 
		 this.clipboardAction = null; // c-copy, m-move
		 this.UpdateScope = null; 
	}
	Explorer.prototype.getFileSystem=function (){
	    try{
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function(fileSystem){ // success get file system
				this.root = fileSystem.root;
				this.listDir(this.root);
			}.bind(this), function(evt){ // error get file system
				alert("File System Error: "+evt.target.error.code);
			}
		);
		}
		catch(e)
		{
		 alert("listDir :  "+e.message)
		}	
	};
	Explorer.prototype.listDir = function (directoryEntry){
	try{
		if( !directoryEntry.isDirectory )
		console.log('listDir incorrect type');
		this.currentDir = directoryEntry; // set current directory
		directoryEntry.getParent(function(par){ // success get parent
			this.parentDir = par; // set parent directory
			//if( (this.parentDir.name == 'sdcard' && this.currentDir.name != 'sdcard') || this.parentDir.name != 'sdcard' ) 
			//alert(this.parentDir.name +"  "+ this.currentDir.name) 
		}.bind(this), function(error){ // error get parent
			console.log('Get parent error: '+error.code);
		});
		var directoryReader = directoryEntry.createReader();
		directoryReader.readEntries(function(entries){
			
			var dirArr = new Array();
			var fileArr = new Array();
			for(var i=0; i<entries.length; ++i){ // sort entries
				var entry = entries[i];
				if( entry.isDirectory && entry.name[0] != '.' ) dirArr.push(entry);
				else if( entry.isFile && entry.name[0] != '.' ) fileArr.push(entry);
			}
//			alert(dirArr.length +"||"+ fileArr.length);
			this.UpdateScope(dirArr,fileArr);
		}.bind(this), function(error){
			console.log('listDir readEntries error: '+error.code);
		});
		}
		catch(e)
		{
		 alert("listDir :  "+e.message)
		}		
	};
	Explorer.prototype.readFile = function (fileEntry){
	try{
		if( !fileEntry.isFile ) console.log('readFile incorrect type');
		fileEntry.file(function(file){
			/*var reader = new FileReader();
			reader.onloadend = function(evt) {
				console.log("Read as data URL");
				console.log(evt.target.result); // show data from file into console
			};
			reader.readAsDataURL(file);*/
			this.UpdateScope(null,null,file);
		}.bind(this), function(error){
			console.log(evt.target.error.code);
		});
		}
		catch(e)
		{
		 alert("readFile :  "+e.message)
		}
	};
	Explorer.prototype.openItem  = function (type){
	try{
		if( type == 'd' ){
			this.listDir(this.activeItem);
		} else if(type == 'f'){
			this.readFile(this.activeItem);
		}
		}
		catch(e)
		{
		 alert("openItem :  "+e.message)
		}
	};
	Explorer.prototype.getActiveItem = function (name, type){
	try{
		if( type == 'd' && this.currentDir != null ){
			this.currentDir.getDirectory(name, {create:false},
				function(dir){ // success find directory
					this.activeItem = dir;
					this.activeItemType = type;
				}.bind(this), 
				function(error){ // error find directory
					console.log('Unable to find directory: '+error.code);
				}
			);
		} else if(type == 'f' && this.currentDir != null){
			this.currentDir.getFile(name, {create:false},
				function(file){ // success find file
					this.activeItem = file;
					this.activeItemType = type;
				}.bind(this),
				function(error){ // error find file
					console.log('Unable to find file: '+error.code);
				}
			);
		}
		}
		catch(e)
		{
		 alert("getActiveItems :  "+e.message)
		}
	};
	Explorer.prototype.getClipboardItem = function (action){
	try{
		if( this.activeItem != null) {
			this.clipboardItem = this.activeItem;
			this.clipboardAction = action;
		}
		}
		catch(e)
		{
		 alert("getClipboardItem : "+e.message)
		}
	}
return Explorer;
})();	
