package com.sc32c3.freemiere.controller;

import java.io.File;
import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sc32c3.freemiere.dao.FileFolderDAO;
import com.sc32c3.freemiere.util.FileManager;
import com.sc32c3.freemiere.vo.FileFolder;
import com.sc32c3.freemiere.vo.FolderVo;

@Controller
public class EditorStorageController {
	private static final Logger logger = LoggerFactory.getLogger(EditorStorageController.class);
	
	@Autowired
	FileFolderDAO fileFolderDAO;
	
	@ResponseBody
	@RequestMapping(value = "loadMyStorageForEditor", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FolderVo> loadMyStorageForEditor(HttpSession session){
		
		logger.info("서버:loadMyStorageForEditor 실행 ");
		
		String email= (String)session.getAttribute("loginMem");
    	String path = "c:\\freemiere\\" + email + "\\"; 
    	
    	ArrayList<FolderVo> rtnList = new ArrayList<>();
    	FolderVo root = new FolderVo(path, 1, 0, "MyStorage", true, true);
    	rtnList.add(root);
    	FileManager.findFolderVoRecursive(path, 1, rtnList);
    	//(String path, int id, int pid, String name, boolean isParent, boolean open)
		
    	FolderVo shared = new FolderVo("", 2, 0, "Shared", true, true);
    	rtnList.add(shared);
    	
    	ArrayList<FileFolder> rtn = fileFolderDAO.getSharedList(email);
    	
    	for(int i = 0; i < rtn.size(); ++i){
			int id = Integer.parseInt( Integer.toString(2) + Integer.toString(i+1) );
			File f = new File(rtn.get(i).getPath());
			FolderVo shared2nd = new FolderVo( f.getAbsolutePath(), 
								id, 2, f.getName(), 
								true, false );
			rtnList.add(shared2nd);
    		FileManager.findFolderVoRecursive(f.getAbsolutePath(), id, rtnList);
    	}
    	
		return rtnList;
	}
	
	@ResponseBody
	@RequestMapping(value = "loadListFile", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadListFile(HttpSession session, String path){
		
		logger.info("서버:loadListFile 실행 {}", path);
		
		if(path == null || path.equals("")) return null;
		
		String email= (String)session.getAttribute("loginMem");
		if(path.equals("root")) path = "c:\\freemiere\\" + email + "\\"; 
		
		File[] fList =FileManager.findFile(path);
		ArrayList<FileFolder> rtnList = new ArrayList<>();
		
		for( File f : fList ) {
			if(f.isDirectory()==true) continue;
			
			String p = f.getAbsolutePath();
			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			
			if(ff == null) continue;
			
			ff.setFileName(f.getName());
			rtnList.add(ff);
		}
		return rtnList;
	}
}
