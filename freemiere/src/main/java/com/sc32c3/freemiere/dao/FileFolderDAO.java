package com.sc32c3.freemiere.dao;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.SynthesizedAnnotation;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.sc32c3.freemiere.vo.FileFolder;

@Repository
public class FileFolderDAO {
	
	@Autowired
	SqlSession sqlSession;
	
	public ArrayList<FileFolder> getSharedBookmarkList(String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getSharedBookmarkList(email);
	}
	
	public ArrayList<FileFolder> getMyStorageBookmarkList(String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getMyStorageBookmarkList(email);
	}
	
	public ArrayList<FileFolder> getSharedList(String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getSharedList(email);
	}
	
	//public ArrayList<FileFolder> getMyStorageList(String email){
	//	FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

	//	return mapper.getMyStorageList(email);
	//}
	
	public ArrayList<FileFolder> getTrashList(String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getTrashList(email);
	}
	
	public FileFolder getFilerFolerInfo(String path, String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		return mapper.getFilerFolerInfo(path, email);
	}
	public int getMyRecentList(String path, String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> recentlist = new HashMap<>();
		recentlist.put("path", path);
		recentlist.put("email", email);
		return mapper.getMyRecentList(recentlist);
	}
	public ArrayList<FileFolder> getSearchList(String title){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getSearchList(title);
	}
	//휴지통으로 파일 폴더 이동
	public int deleteFileFolder(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		return mapper.deleteFileFolder(ffid); 
	}
	//북마크된 파일 폴더 휴지통으로 이동
	public int deleteBookmarks(int ffid, String email) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> bookmarks = new HashMap<>();
		bookmarks.put("ffid", ffid);
		bookmarks.put("email", email);
		
		return mapper.deleteBookmarks(bookmarks);
	}
	//공유된 폴더 휴지통으로 이동
	public int deleteShare(int ffid, String email) {
		FileFolderMapper maaper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> shares = new HashMap<>();
		shares.put("ffid", ffid);
		shares.put("email", email);
		
		return maaper.deleteShare(shares);
	}
	//파일업로드
	public int upload(FileFolder fileFolder) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		return mapper.upload(fileFolder);
	}
	
	// 새폴더
	public int newDir(String path, String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.newDir(path, email);
	}
	// 파일 다운로드
	public int saveFile(String path){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.saveFile(path);
	}

	// 휴지통에서 삭제
	public void completeDelete(ArrayList<File>fileList,String email) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		 String thumPath = "c:\\freemiere\\" + email+"\\"+"." + "thumb\\" ;
		 
		for(int i=fileList.size()-1; i>=0; i--){
			String deletePath = fileList.get(i).getAbsolutePath();
			
			if(fileList.get(i).isDirectory()==true){
				deletePath +="\\";
				fileList.get(i).delete();
			}else{
				fileList.get(i).delete();
				//썸네일 파일 삭제
				File thumbFile = new File(thumPath);
				File[] thumbFiles = thumbFile.listFiles();
				for (File thumb : thumbFiles) {
					if((thumb.getName()).equals(fileList.get(i).getName()+".png")){
						thumb.delete();
						System.out.println("성공");
					}
				}
				
			}
			fileList.get(i).delete();
			mapper.completeDelete(deletePath);
		}
		

	}
	
	//복원
	public void restore(ArrayList<File> reFileList) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		for(int i=0; i<reFileList.size();i++){
			
			if(reFileList.get(i).isDirectory()==true){
 				String reFilePath = reFileList.get(i).getAbsolutePath()+"\\";
 				System.out.println("dao:"+reFilePath);
				mapper.restore(reFilePath);
			}else{
				String reFilePath = reFileList.get(i).getAbsolutePath();
				mapper.restore(reFilePath);
			}
		}
		
	}

	
}

