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
		var sucess = function(fileSystem){ // success get file system
				this.root = fileSystem.root;
				this.listDir(this.root);
			}.bind(this);
		var error = function(evt){ // error get file system
				console.log("File System Error: "+evt.target.error.code);
			};
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,sucess,error);
		}
		catch(e)
		{
		 console.log("listDir :  "+e.message)
		}	
	};
	Explorer.prototype.listDir = function (directoryEntry){
		try
		{
			if( !directoryEntry.isDirectory )
			console.log('listDir incorrect type');
			this.currentDir = directoryEntry; // set current directory
			
			var sucess = function(par){ // success get parent
				this.parentDir = par; // set parent directory
				//if( (this.parentDir.name == 'sdcard' && this.currentDir.name != 'sdcard') || this.parentDir.name != 'sdcard' ) 
				//console.log(this.parentDir.name +"  "+ this.currentDir.name) 
			}.bind(this);
			var error = function(error){ // error get parent
				console.log('Get parent error: '+error.code);
			};
			directoryEntry.getParent(sucess,error);
			
			var directoryReader = directoryEntry.createReader();
			var readSucess =function(entries){
				
				var dirArr = new Array();
				var fileArr = new Array();
				for(var i=0; i<entries.length; ++i){ // sort entries
					var entry = entries[i];
					if( entry.isDirectory && entry.name[0] != '.' ) dirArr.push(entry);
					else if( entry.isFile && entry.name[0] != '.' ) fileArr.push(entry);
				}
	//			console.log(dirArr.length +"||"+ fileArr.length);
				this.UpdateScope(dirArr,fileArr);
			}.bind(this);
			var readError = function(error){
				console.log('listDir readEntries error: '+error.code);
			};
			directoryReader.readEntries(readSucess,readError);
		}
		catch(e)
		{
		 console.log("listDir :  "+e.message)
		}		
	};
	Explorer.prototype.readFile = function (fileEntry){
	try{
			if( !fileEntry.isFile )
			console.log('readFile incorrect type');
			var sucess = function(file){
				/*var reader = new FileReader();
				reader.onloadend = function(evt) {
					console.log("Read as data URL");
					console.log(evt.target.result); // show data from file into console
				};
				reader.readAsDataURL(file);*/
				this.UpdateScope(null,null,file);
			}.bind(this);
			var error = function(error){
				console.log("file read error:"+evt.target.error.code);
			};
			fileEntry.file(sucess,error);
		}
		catch(e)
		{
		 console.log("readFile :  "+e.message)
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
		 console.log("openItem :  "+e.message)
		}
	};
	Explorer.prototype.getActiveItem = function (name, type){
	try{
	//console.log(this.activeItemType +"||"+type);
			var sucess =function(dir){ // success find directory
			//console.log("cb dir");
						this.activeItem = dir;
						this.activeItemType = type;
						this.openItem('d');
					}.bind(this);
			var error = function(error){ // error find directory
						console.log('Unable to find directory: '+error.code);
					};
			var fileSucess = function(file){ // success find file
			//console.log("cb file")
						this.activeItem = file;
						this.activeItemType = type;
						this.openItem('f');
				}.bind(this);
			var fileError = function(error){ // error find file
						console.log('Unable to find file: '+error.code);
					};
			if( type == 'd' && this.currentDir != null ){
				//console.log("dir:"+name);
				this.currentDir.getDirectory(name, {create:false, exclusive: false},sucess,error);
			} else if(type == 'f' && this.currentDir != null){
				//console.log("File:"+name);
				this.currentDir.getFile(name, {create:false, exclusive: false},fileSucess,fileError);
			}
		}
		catch(e)
		{
			console.log("getActiveItems :  "+e.message)
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
			console.log("getClipboardItem : "+e.message)
		}
	}
return Explorer;
})();	
