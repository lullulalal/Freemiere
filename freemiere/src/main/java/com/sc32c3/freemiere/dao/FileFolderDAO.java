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
	
	public int bookmarkUpdate(int ffid,String bookstate) {
		// TODO Auto-generated method stub
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> map = new HashMap<>();
		map.put("ffid", ffid);
		map.put("bookstate", bookstate);
		return mapper.bookmarkUpdate(map);
	}
	
	public int bookmarkInsert(int ffid, String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> map = new HashMap<>();
		map.put("ffid", ffid);
		map.put("email", email);
		return mapper.bookmarkInsert(map);
	}
	
	public FileFolder boardread(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.boardread(ffid);
		
	}

	public int conDelete(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.conDelete(ffid);
		
	}
	
	
	public int conRemove(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.conRemove(ffid);
	}
	
	public int conAllRemove(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.conAllRemove(ffid);
	}
	
	public int conBookDelete(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.conBookDelete(ffid);
	}
	
	
	
	public FileFolder bookmarkSearch(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.bookmarkSearch(ffid);
	}
	public int folderShare(int ffid,String isShared) {
		// TODO Auto-generated method stub
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> map = new HashMap<>();
		map.put("ffid", ffid);
		map.put("isShared", isShared);
		return mapper.bookmarkUpdate(map);
	}
	
	public int sokUpdate(int ffid, String info, String path1) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> filefolders = new HashMap<>();
		filefolders.put("ffid", ffid);
		filefolders.put("info", info);
		filefolders.put("path", path1);
		
		return mapper.sokUpdate(filefolders);
	}
	
	
	public int shareInsert(int ffid, String email,String auth) {
		FileFolderMapper maaper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> shares = new HashMap<>();
		shares.put("ffid", ffid);
		shares.put("email", email);
		shares.put("auth", auth);
		return maaper.shareInsert(shares);
	}
	
	
	public ArrayList<FileFolder> shareList(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.shareList(ffid);
	}
	
	public FileFolder searchShare(int ffid, String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> shares = new HashMap<>();
		shares.put("ffid", ffid);
		shares.put("email", email);
		return mapper.searchShare(shares);
	}
	
	public int updateAuth(int ffid, String email,String auth) {
		FileFolderMapper maaper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> shares = new HashMap<>();
		shares.put("ffid", ffid);
		shares.put("email", email);
		shares.put("auth", auth);
		
		return maaper.updateAuth(shares);
	}
	public int updateFileShare(int ffid) {
		FileFolderMapper maaper = sqlSession.getMapper(FileFolderMapper.class);
		
		return maaper.updateFileShare(ffid);
	}
	
	public int firstOwner(int ffid, String myEmail){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> shares = new HashMap<>();
		shares.put("ffid", ffid);
		shares.put("myEmail", myEmail);
		return mapper.firstOwner(shares);
	}
}

