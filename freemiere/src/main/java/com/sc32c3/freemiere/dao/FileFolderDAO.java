package com.sc32c3.freemiere.dao;

import java.io.File;
import java.util.ArrayList;
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

	//휴지통에서 삭제
	public void completeDeleteFileFolder(int ffid) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		mapper.completeDeleteFileFolder(ffid);
	}
	
	//복원
	public int restore(int ffid) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		return mapper.restore(ffid);
	}
}

