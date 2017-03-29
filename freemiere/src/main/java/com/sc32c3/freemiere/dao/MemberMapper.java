package com.sc32c3.freemiere.dao;

import com.sc32c3.freemiere.vo.Member;

public interface MemberMapper {
	public Member getMember(String email);
}
