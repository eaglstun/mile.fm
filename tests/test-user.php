<?php

use PHPUnit\Framework\TestCase;

final class UserTest extends TestCase
{
    public function testCreateUser()
    {
        $username = '';
        $password = '';

        $User = new User;
        $User->setName( $username );
        $User->setPass( $password );
        $User->createNew();
    }
}